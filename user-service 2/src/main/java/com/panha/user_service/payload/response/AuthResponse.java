package com.panha.user_service.payload.response;

import com.panha.user_service.domain.UserRole;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String refresh_Token;
    private String message;
    private String title;
    private UserRole role; 
}
