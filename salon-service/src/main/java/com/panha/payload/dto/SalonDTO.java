package com.panha.payload.dto;

import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class SalonDTO {

    private Long id;
    private String name;
    private List<String> image;
    private String address;
    private String phoneNumber;
    private String email;
    private String city;
    private Long ownerId;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime openTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime closeTime;
}