package com.panha.user_service.service;

import com.panha.user_service.payload.dto.SignupDTO;
import com.panha.user_service.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse authenticate(String email, String password, String platform);

    AuthResponse signup(SignupDTO req) throws Exception;

    AuthResponse getAccessTokenFromRefreshToken(String refreshToken);
}