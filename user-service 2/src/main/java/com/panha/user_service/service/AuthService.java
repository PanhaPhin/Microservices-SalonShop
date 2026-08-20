package com.panha.user_service.service;

import com.panha.user_service.domain.Platform;
import com.panha.user_service.payload.dto.SignupDTO;
import com.panha.user_service.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse authenticate(String username, String password, String platform) throws Exception;

    AuthResponse signup(SignupDTO req) throws Exception;

    AuthResponse getAccessTokenFromRefreshToken(String refreshToken);
}