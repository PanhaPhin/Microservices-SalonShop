package com.panha.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panha.dto.SalonDTO;

@FeignClient("SALON-SERVICE")
public interface SalonFeignClient {

    // 🔥 FIXED: /salons (plural)
    @GetMapping("/api/salons/owner")
    ResponseEntity<SalonDTO> getSalonByOwnerId(
            @RequestHeader("Authorization") String jwt
    );

    @GetMapping("/api/salons/{salonId}")
    ResponseEntity<SalonDTO> getSalonById(
            @PathVariable Long salonId
    );
}