package com.panha.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.panha.domain.PaymentMethod;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.response.PaymentLinkResponse;

@FeignClient(name = "PAYMENT-SERVICE")
public interface PaymentFeignClient {

    @PostMapping("/api/payments/create")
    PaymentLinkResponse createPaymentLink(
            @RequestBody BookingDTO bookingDTO,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String authorization
    );
}
