package com.panha.dto;

import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;


@Data
public class SalonDTO {

    private Long id;

    private String name;

    private String description;

    private List<String> image;

    private String address;

    private String phoneNumber;

    private String email;

    private String city;

    private String pincode;

    /**
     * This is normally returned by backend.
     * Frontend does not need to send it.
     */
    private Long ownerId;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime openTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime closeTime;
    
}
