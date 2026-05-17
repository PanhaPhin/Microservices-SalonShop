package com.panha.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panha.payload.dto.SalonDTO;





@FeignClient("SALON-SERVICE")
public interface  SalonFeignClient {

    @GetMapping("/api/salon/owner")
    public ResponseEntity<SalonDTO> getSalonByOwnerId(
        
        @RequestHeader("Authorization")String jwt
    ) throws Exception;

    @GetMapping("/api/salons/{salonId}")
    public ResponseEntity<SalonDTO> getSalonById(
        @PathVariable Long salonId 
        
    ) throws Exception;
    
}
