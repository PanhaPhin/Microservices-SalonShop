package com.panha.user_service.service.imp;

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

    @Override
    public AuthResponse authenticate(String username, String password, String platform)  {

        TokenResponse tokenResponse = keycloakService.loginUser(username, password);

        if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
            throw new RuntimeException("Invalid login response from Keycloak");
        }

        AuthResponse res = new AuthResponse();
        res.setJwt(tokenResponse.getAccessToken());
        res.setRefresh_Token(tokenResponse.getRefreshToken());
        res.setMessage("Login successful");

        return res;
    }

    @Override
    @Transactional
    public AuthResponse signup(SignupDTO req) throws Exception {

        if (userRepository.findByUsername(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Set username from email before Keycloak
        req.setUsername(req.getEmail());

        keycloakService.createUser(req);

        User user = new User();

        user.setUsername(req.getEmail());
        user.setEmail(req.getEmail());
        user.setFullName(req.getFullName());
        user.setRole(req.getRole());
        user.setPassword(req.getPassword());

        userRepository.save(user);

        TokenResponse tokenResponse
                = keycloakService.loginUser(req.getEmail(), req.getPassword());

        AuthResponse res = new AuthResponse();

        res.setJwt(tokenResponse.getAccessToken());
        res.setRefresh_Token(tokenResponse.getRefreshToken());
        res.setRole(user.getRole());
        res.setMessage("Signup successful");

        return res;
    }

    @Override
    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken) {

        TokenResponse tokenResponse = keycloakService.refreshToken(refreshToken);

        AuthResponse res = new AuthResponse();
        res.setJwt(tokenResponse.getAccessToken());
        res.setRefresh_Token(tokenResponse.getRefreshToken());
        res.setMessage("Token refreshed");

        return res;
    }
}
