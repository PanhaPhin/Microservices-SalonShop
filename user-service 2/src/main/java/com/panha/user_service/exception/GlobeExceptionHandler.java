package com.panha.user_service.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.panha.user_service.payload.response.ExceptionResponse;

public class GlobeExceptionHandler {

     @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleAllExceptions(Exception ex, WebRequest req) {
        ExceptionResponse response = new ExceptionResponse(
            ex.getMessage(),
            req.getDescription(false),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
}
