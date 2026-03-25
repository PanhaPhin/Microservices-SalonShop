package com.panha.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panha.domain.PaymentMethod;
import com.panha.model.PaymentOrder;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.payload.response.PaymentLinkResponse;
import com.panha.service.PaymentService;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
        @RequestBody BookingDTO booking,
        @RequestParam PaymentMethod paymentMethod
      ) throws StripeException,RazorpayException,RuntimeException{


        UserDTO user=new UserDTO();
        user.setFullname("Panha");
        user.setEmail("sopanhaphin18@gmail.com");
        user.setId(1L);

        PaymentLinkResponse res=paymentService.createOrder(user, booking, paymentMethod);
        return ResponseEntity.ok(res);        

      }

      @GetMapping("/{paymentOrderId}")
    public ResponseEntity<PaymentOrder> getPaymentOrderById(
        @PathVariable Long paymentOrderId
      ) throws Exception{
        PaymentOrder res=paymentService.getPaymentOrderById(paymentOrderId);
        return ResponseEntity.ok(res);        
      }


      @PatchMapping("/proceed")
      public ResponseEntity<Boolean> proceedPayment(
           @RequestParam String paymentId,
           @RequestParam String paymentLinkId

      ) throws Exception{

        PaymentOrder paymentOrder =
                paymentService.getPaymentOrderByPaymentId(paymentLinkId);
        
        Boolean res=paymentService.proceedPayment(paymentOrder, paymentId, paymentLinkId);

        return ResponseEntity.ok(res);
        
      }
    
}
