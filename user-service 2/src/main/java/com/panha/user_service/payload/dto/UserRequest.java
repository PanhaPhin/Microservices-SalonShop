package com.panha.user_service.payload.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class UserRequest {
    private String firstName;
    private String lastName;

    private String email;
    private Boolean enabled;
    private String username;
    private List<Credential> credentials=new ArrayList<>();
}
