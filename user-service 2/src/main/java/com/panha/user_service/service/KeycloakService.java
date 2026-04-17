package com.panha.user_service.service;

import java.lang.reflect.Array;
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
    private static final String KEYCLOAK_ADMIN_API=KEYCLOAK_BASE_URL+"/admin/realms/master/users";
    private static final String TOKEN_URL= KEYCLOAK_BASE_URL+"/realms/master/protocol/openid-connect/token";

    private static final String CLIENT_ID = "salon-booking-client";
    private static final String CLIENT_SECRET = "Zj1p8I7NgI69f5cfAzkesSeY3l7CW9GB";
    private static final String GRANT_TYPE = "password";
    private static final String scope = "openid profile email";
    private static final String username = "admin";
    private static final String password = "admin";
    private static final String clientId="5c89d0a9-1e77-4a81-8953-d7278f389fb5";

    private final RestTemplate restTemplate;


    public void createUser(SignupDTO signupDTO) throws Exception {

        String ACCESS_TOKEN = getAdminAccessToken(username, 
                 password,
                 GRANT_TYPE,null).getAccessToken();

        Credential credential = new Credential();
        credential.setTemporary(false);
        credential.setType("password");
        credential.setValue(signupDTO.getPassword());

    UserRequest userRequest = new UserRequest();
    userRequest.setUsername(signupDTO.getUsername());
    userRequest.setFirstName(signupDTO.getFirstName());
    userRequest.setLastName(signupDTO.getLastName());
    userRequest.setEmail(signupDTO.getEmail());
    userRequest.setEnabled(true);
    userRequest.setCredentials(List.of(credential));


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(ACCESS_TOKEN);


        HttpEntity<UserRequest> requestEntity= new HttpEntity<>(userRequest,headers);

        ResponseEntity<String> response = restTemplate.exchange(
            KEYCLOAK_ADMIN_API,
            HttpMethod.POST,
            requestEntity,
            String.class
        ); 

        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("User created successfully in Keycloak.");

            KeycloakUserDTO user = fetchFirstUserByUsername(signupDTO.getUsername(), ACCESS_TOKEN);

            KeycloakRole role = getRoleByName(clientId, ACCESS_TOKEN, signupDTO.getRole().toString());

            List<KeycloakRole> roles = new ArrayList<>();
            roles.add(role);


            assignRoleToUser(user.getId(),
                      clientId,
                      roles,
                      ACCESS_TOKEN);
        } else {
            System.out.println("Failed to create user in Keycloak. Status code: " + response.getStatusCode());
        }

    }

    public TokenResponse getAdminAccessToken(String username, String password , String grantType, String refreshToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id",grantType);
        requestBody.add("username", username);
        requestBody.add("password", password);
        requestBody.add("refresh_token", refreshToken);
        requestBody.add("client_id", CLIENT_ID);
        requestBody.add("client_secret", CLIENT_SECRET);
        requestBody.add("scope", scope);


        HttpEntity<MultiValueMap<String, String>> requestEntity= new HttpEntity<>(requestBody,headers);

        ResponseEntity<TokenResponse> response = restTemplate.exchange(
            TOKEN_URL,
            HttpMethod.POST,
            requestEntity,
            TokenResponse.class
        );

        if(response.getStatusCode()==HttpStatus.OK && response.getBody()!=null){
            return response.getBody();
        }else{
            throw new RuntimeException("Failed to get role "
            + response.getStatusCode());
        } 
        
    }
    public KeycloakRole getRoleByName(String clientId, String token, String role){

        String url = KEYCLOAK_BASE_URL+"admin/realms/master/clients/" + clientId + "/roles/" + role;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);


        HttpEntity<Void> requestEntity= new HttpEntity<>(headers);

        ResponseEntity<KeycloakRole> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            requestEntity,
            KeycloakRole.class
        );

       
            return response.getBody();
       
    
    }

    public KeycloakUserDTO fetchFirstUserByUsername(String username, String token) {

        String url = KEYCLOAK_BASE_URL+"admin/realms/master/users?username=" + username;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<String> requestEntity= new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO[]> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            requestEntity,
            KeycloakUserDTO[].class
        );
        KeycloakUserDTO[] users = response.getBody();

        if (users!=null && users.length > 0) {
            return users[0];
        } else {
            throw new RuntimeException("User not found in Keycloak with username: " + username);
        }

       
           
    }

    public void assignRoleToUser(String userId, 
                                  String clientId, 
                                  List<KeycloakRole> roles,
                                  String token
                                  ) {


    String url = KEYCLOAK_BASE_URL+"/admin/realms/master/users/" + userId + "/role-mappings/clients/" + clientId;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        
        headers.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<List<KeycloakRole>> requestEntity= new HttpEntity<>(roles, headers);
          

        ResponseEntity<String> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            String.class
        );
       


       
        
    }


}
