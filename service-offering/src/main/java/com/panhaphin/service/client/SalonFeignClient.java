package com.panhaphin.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panhaphin.dto.SalonDTO;

@FeignClient("salon-service")
public interface  SalonFeignClient {

    @GetMapping("/api/salon/owner")
    public ResponseEntity<SalonDTO> getSalonByOwnerId(
        
        @RequestHeader("Authorization")String jwt
    ) throws Exception;
    
}
