package com.panha.dto;

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

   
    private String qrCode;     
    private String publicKey;  
    
}
