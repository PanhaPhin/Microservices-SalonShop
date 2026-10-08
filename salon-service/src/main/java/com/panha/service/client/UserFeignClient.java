package com.panha.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panha.payload.dto.UserDTO;

@FeignClient("user-service")
public interface UserFeignClient {

    @GetMapping("/api/users/{userId}")
    ResponseEntity<UserDTO> getUserById(
            @PathVariable("userId") Long userId
    ) throws Exception;

    @GetMapping("/api/users/profile")
    ResponseEntity<UserDTO> getUserProfile(
            @RequestHeader("Authorization") String jwt
    ) throws Exception;
}
