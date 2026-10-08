package com.panhaphin.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panhaphin.dto.SalonDTO;

@FeignClient(name = "salon-service")
public interface SalonFeignClient {

    @GetMapping("/api/salons/owner")
    ResponseEntity<SalonDTO> getSalonByOwnerId(
            @RequestHeader("Authorization") String jwt
    );

    @GetMapping("/api/salons/{salonId}")
    ResponseEntity<SalonDTO> getSalonById(
            @PathVariable("salonId") Long salonId
    ) throws Exception;
}
