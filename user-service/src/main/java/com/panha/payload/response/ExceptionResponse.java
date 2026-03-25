package com.panha.payload.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;

@AllArgsConstructor

public class ExceptionResponse {
    private  String message;
    private String error;
    private LocalDateTime timestamp;
    
}
