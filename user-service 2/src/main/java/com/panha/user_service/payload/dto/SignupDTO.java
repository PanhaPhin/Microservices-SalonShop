package com.panha.user_service.payload.dto;

import com.panha.user_service.domain.UserRole;

import lombok.Data;

@Data
public class SignupDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String username;
    private UserRole role;
    
}
