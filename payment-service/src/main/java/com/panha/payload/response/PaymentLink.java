package com.panha.payload.response;

import com.panha.domain.PaymentMethod;

public class PaymentLink {

    private String url;
    private String paymentId;
    private Long amount;
    private PaymentMethod method;

    // Optional fields
    private String qrCode;     // Bakong
    private String publicKey;  // Razorpay

    // Default Constructor
    public PaymentLink() {}

    // Parameterized Constructor
    public PaymentLink(String url, String paymentId, Long amount, PaymentMethod method) {
        this.url = url;
        this.paymentId = paymentId;
        this.amount = amount;
        this.method = method;
    }

    // Getters & Setters
    public String getUrl() { 
        return url; 
    }
    
    public void setUrl(String url) { 
        this.url = url; 
    }

    public String getPaymentId() { 
        return paymentId; 
    }

    public void setPaymentId(String paymentId) { 
        this.paymentId = paymentId; 
    }

    public Long getAmount() { 
        return amount; 
    }

    public void setAmount(Long amount) { 
        this.amount = amount; 
    }

    public PaymentMethod getMethod() { 
        return method; 
    }

    public void setMethod(PaymentMethod method) { 
        this.method = method; 
    }

    public String getQrCode() { 
        return qrCode; 
    }

    public void setQrCode(String qrCode) { 
        this.qrCode = qrCode; 
    }

    public String getPublicKey() { 
        return publicKey; 
    }

    public void setPublicKey(String publicKey) { 
        this.publicKey = publicKey; 
    }
}