package com.panha.user_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.panha.user_service.payload.dto.Credential;
import com.panha.user_service.payload.dto.KeycloakRole;
import com.panha.user_service.payload.dto.KeycloakUserDTO;
import com.panha.user_service.payload.dto.SignupDTO;
import com.panha.user_service.payload.dto.UserRequest;
import com.panha.user_service.payload.response.TokenResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private static final String KEYCLOAK_BASE_URL = "http://localhost:8080";

    private static final String REALM = "master";
    

    private static final String KEYCLOAK_ADMIN_USERS
            = KEYCLOAK_BASE_URL + "/admin/realms/master/users";
  

    private static final String TOKEN_URL
            = KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/token";


    private static final String CLIENT_ID = "salon-booking-client";
    private static final String CLIENT_SECRET = "Zj1p8I7NgI69f5cfAzkesSeY3l7CW9GB";

    private static final String GRANT_TYPE = "password";

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin";

    private static final String REALM_CLIENT_ID = "5c89d0a9-1e77-4a81-8953-d7278f389fb5";

    private final RestTemplate restTemplate;

    private String getRealmUrl() {
        return KEYCLOAK_BASE_URL + "/realms/" + REALM;
    }

    private String getAdminUrl() {
        return KEYCLOAK_BASE_URL + "/admin/realms/" + REALM;
    }

    public void createUser(SignupDTO signupDTO) throws Exception {

        String token = getAdminAccessToken(
                ADMIN_USERNAME,
                ADMIN_PASSWORD,
                GRANT_TYPE,
                null
        ).getAccessToken();

        List<KeycloakUserDTO> existingUsers
                = findUserByEmail(signupDTO.getEmail(), token);

        if (!existingUsers.isEmpty()) {
            throw new RuntimeException(
                    "User already exists with email: " + signupDTO.getEmail()
            );
        }

        Credential credential = new Credential();
        credential.setTemporary(false);
        credential.setType("password");
        credential.setValue(signupDTO.getPassword());

        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(signupDTO.getUsername());
        userRequest.setFirstName(signupDTO.getFullName());
        userRequest.setEmail(signupDTO.getEmail());
        userRequest.setEnabled(true);
        userRequest.setCredentials(List.of(credential));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<UserRequest> request = new HttpEntity<>(userRequest, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                KEYCLOAK_ADMIN_USERS,
                HttpMethod.POST,
                request,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException(
                    "Failed to create user in Keycloak: " + response.getStatusCode()
            );
        }

        KeycloakUserDTO user
                = fetchFirstUserByUsername(signupDTO.getUsername(), token);

        KeycloakRole role = getRoleByName(
                REALM_CLIENT_ID,
                token,
                signupDTO.getRole().toString()
        );

        assignRoleToUser(user.getId(), REALM_CLIENT_ID, List.of(role), token);
    }

    public TokenResponse getAdminAccessToken(
            String username,
            String password,
            String grantType,
            String refreshToken
    ) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();

        body.add("grant_type", "password");
        body.add("client_id", CLIENT_ID);
        body.add("client_secret", CLIENT_SECRET);
        body.add("username", username);
        body.add("password", password);
        body.add("scope", "openid profile email");

        if (refreshToken != null) {
            body.add("refresh_token", refreshToken);
        }

        HttpEntity<MultiValueMap<String, String>> request
                = new HttpEntity<>(body, headers);

        ResponseEntity<TokenResponse> response = restTemplate.exchange(
                TOKEN_URL,
                HttpMethod.POST,
                request,
                TokenResponse.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        }

        throw new RuntimeException("Failed to get token: " + response.getStatusCode());
    }

    public List<KeycloakUserDTO> findUserByEmail(String email, String token) {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/users?email=" + email;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakUserDTO[].class
        );

        if (response.getBody() == null) {
            return new ArrayList<>();
        }

        return List.of(response.getBody());
    }

    public KeycloakUserDTO fetchFirstUserByUsername(String username, String token) {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/users?username=" + username;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakUserDTO[].class
        );

        KeycloakUserDTO[] users = response.getBody();

        if (users != null && users.length > 0) {
            return users[0];
        }

        throw new RuntimeException("User not found: " + username);
    }

    public KeycloakRole getRoleByName(
            String clientId,
            String token,
            String role
    ) {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/clients/"
                + clientId
                + "/roles/"
                + role;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakRole> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakRole.class
        );

        return response.getBody();
    }

    public void assignRoleToUser(
            String userId,
            String clientId,
            List<KeycloakRole> roles,
            String token
    ) throws Exception {

        String url = KEYCLOAK_BASE_URL
                + "/admin/realms/master/users/"
                + userId
                + "/role-mappings/clients/"
                + clientId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<KeycloakRole>> request
                = new HttpEntity<>(roles, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException(
                    "Failed to assign role: " + response.getStatusCode()
            );
        }
    }

//     public TokenResponse loginUser(String username, String password) {
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//         MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
//         body.add("grant_type", "password");
//         body.add("client_id", CLIENT_ID);
//         body.add("client_secret", CLIENT_SECRET);
//         body.add("username", username);
//         body.add("password", password);
//         HttpEntity<MultiValueMap<String, String>> request
//                 = new HttpEntity<>(body, headers);
//         ResponseEntity<TokenResponse> response = restTemplate.exchange(
//                 TOKEN_URL,
//                 HttpMethod.POST,
//                 request,
//                 TokenResponse.class
//         );
//         return response.getBody();
//     }
    public TokenResponse loginUser(String username, String password) {

        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body
                    = new LinkedMultiValueMap<>();

            body.add("grant_type", "password");
            body.add("client_id", CLIENT_ID);
            body.add("client_secret", CLIENT_SECRET);
            body.add("username", username);
            body.add("password", password);

            HttpEntity<MultiValueMap<String, String>> request
                    = new HttpEntity<>(body, headers);

            ResponseEntity<TokenResponse> response
                    = restTemplate.exchange(
                            TOKEN_URL,
                            HttpMethod.POST,
                            request,
                            TokenResponse.class
                    );

            return response.getBody();

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Keycloak login failed: " + e.getMessage()
            );
        }
    }

    public TokenResponse refreshToken(String refreshToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", CLIENT_ID);
        body.add("client_secret", CLIENT_SECRET);
        body.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> request
                = new HttpEntity<>(body, headers);

        ResponseEntity<TokenResponse> response = restTemplate.exchange(
                TOKEN_URL,
                HttpMethod.POST,
                request,
                TokenResponse.class
        );

        return response.getBody();
    }

    public KeycloakUserDTO fetchUserProfileByJwt(String token) {

        String url = KEYCLOAK_BASE_URL
                + "/realms/" + REALM + "/protocol/openid-connect/userinfo";

        HttpHeaders headers = new HttpHeaders();

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                KeycloakUserDTO.class
        );

        return response.getBody();
    }
}
