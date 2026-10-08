package com.panha.user_service.service.imp;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.panha.user_service.modal.User;
import com.panha.user_service.payload.dto.SignupDTO;
import com.panha.user_service.payload.response.AuthResponse;
import com.panha.user_service.payload.response.TokenResponse;
import com.panha.user_service.repository.UserRepository;
import com.panha.user_service.service.AuthService;
import com.panha.user_service.service.KeycloakService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse authenticate(String email, String password, String platform) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TokenResponse tokenResponse
                = keycloakService.loginUser(user.getUsername(), password);

        if (tokenResponse == null
                || tokenResponse.getAccessToken() == null) {
            throw new RuntimeException("Invalid login response from Keycloak");
        }

        AuthResponse res = new AuthResponse();
        res.setJwt(tokenResponse.getAccessToken());
        res.setRefresh_Token(tokenResponse.getRefreshToken());
        res.setRole(user.getRole());
        res.setMessage("Login successful");

        return res;
    }

    @Override
    @Transactional
    public AuthResponse signup(SignupDTO req) throws Exception {

        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check email
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // DO NOT change username to email
        String keycloakId = keycloakService.createUser(req);

        User user = new User();

        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setFullName(req.getFullName());
        user.setRole(req.getRole());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setKeycloakId(keycloakId);

        userRepository.save(user);

        // Login using the actual username
        TokenResponse tokenResponse
                = keycloakService.loginUser(req.getUsername(), req.getPassword());

        AuthResponse res = new AuthResponse();

        res.setJwt(tokenResponse.getAccessToken());
        res.setRefresh_Token(tokenResponse.getRefreshToken());
        res.setRole(user.getRole());
        res.setMessage("Signup successful");

        return res;
    }

    @Override
    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
        throw new RuntimeException("Refresh token is required");
    }

        TokenResponse tokenResponse = keycloakService.refreshToken(refreshToken);

        if (tokenResponse == null
            || tokenResponse.getAccessToken() == null
            || tokenResponse.getAccessToken().isBlank()) {

        throw new RuntimeException(
                "Invalid response from Keycloak while refreshing token"
        );
    }


        AuthResponse res = new AuthResponse();

        res.setJwt(tokenResponse.getAccessToken());
        res.setRefresh_Token(tokenResponse.getRefreshToken());
        res.setMessage("Token refreshed");

        return res;
    }
}
