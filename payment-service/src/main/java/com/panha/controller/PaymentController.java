package com.panha.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panha.domain.PaymentMethod;
import com.panha.model.PaymentOrder;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.payload.response.PaymentLinkResponse;
import com.panha.service.PaymentService;
import com.panha.service.client.UserFeignClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserFeignClient userFeignClient;

    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestBody BookingDTO booking,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();

        PaymentLinkResponse res =
                paymentService.createOrder(user, booking, paymentMethod);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{paymentOrderId}")
    public ResponseEntity<PaymentOrder> getPaymentOrderById(
            @PathVariable Long paymentOrderId
    ) throws Exception {

        return ResponseEntity.ok(
                paymentService.getPaymentOrderById(paymentOrderId)
        );
    }

    @PatchMapping("/proceed")
    public ResponseEntity<Boolean> proceedPayment(
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId
    ) throws Exception {

        PaymentOrder paymentOrder =
                paymentService.getPaymentOrderByPaymentId(paymentLinkId);

        Boolean result =
                paymentService.proceedPayment(
                        paymentOrder,
                        paymentId,
                        paymentLinkId
                );

        return ResponseEntity.ok(result);
    }
}