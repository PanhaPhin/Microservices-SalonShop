package com.panha.payload.dto;

import java.time.LocalDateTime;

import com.panha.payload.SalonDTO;
import com.panha.payload.UserDTO;

import lombok.Data;

@Data
public class ReviewDTO {

    private Long id;
    private UserDTO user;
    private SalonDTO salon;
    private String reviewText;
    private double rating;
    private LocalDateTime createdAt;

}