package com.panha.payload.response;

import com.panha.domain.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLinkResponse {

    private String url;
    private String paymentId;
    private Long amount;
    private PaymentMethod method;

    // Optional fields for specific providers
    private String qrCode;     // Bakong
    private String publicKey;  // Razorpay
}