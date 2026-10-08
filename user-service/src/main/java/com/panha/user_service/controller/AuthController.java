package com.panha.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panha.user_service.payload.dto.LoginDTO;
import com.panha.user_service.payload.dto.RefreshTokenRequest;
import com.panha.user_service.payload.dto.SignupDTO;
import com.panha.user_service.payload.response.AuthResponse;
import com.panha.user_service.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupDTO req) throws Exception {
        return ResponseEntity.ok(authService.signup(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO req) throws Exception {
        return ResponseEntity.ok(
                authService.authenticate(req.getEmail(), req.getPassword(), req.getPlatform())
        );
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody RefreshTokenRequest req
    ) throws Exception {

        return ResponseEntity.ok(
                authService.getAccessTokenFromRefreshToken(req.getRefreshToken())
        );
    }

}
