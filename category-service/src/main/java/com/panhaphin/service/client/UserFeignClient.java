package com.panhaphin.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panhaphin.dto.CategoryDTO;


@FeignClient("user-service")
public interface UserFeignClient {

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<CategoryDTO> getUserById(
            @PathVariable("userId") Long id
    ) throws Exception;

    @GetMapping("/api/users/profile")
    public ResponseEntity<CategoryDTO> getUserProfile(
        @RequestHeader("Authorization")String jwt
    ) throws Exception;

}
