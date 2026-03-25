package com.panhaphin.dto;

import java.util.List;

import lombok.Data;


@Data
public class SalonDTO {

    private Long id ;
    private String name;
    private List<String> images;
    private String address;
    private String phoneNumber;
    private String email;
    private String city;
    private Long ownerId;
    
}
