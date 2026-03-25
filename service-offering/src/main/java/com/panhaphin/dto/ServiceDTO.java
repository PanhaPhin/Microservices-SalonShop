package com.panhaphin.dto;


import lombok.Data;

@Data
public class ServiceDTO {

    private Long id;

    private String name;

 
    private String description;

    
    private int price;

   
    private int duration;

    
    private Long category;

    private Long salonId;

    private String image;
    
}
