package com.panha.user_service.payload.dto;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}
