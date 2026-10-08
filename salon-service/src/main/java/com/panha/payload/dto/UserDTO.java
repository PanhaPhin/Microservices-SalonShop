package com.panha.payload.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    
}
