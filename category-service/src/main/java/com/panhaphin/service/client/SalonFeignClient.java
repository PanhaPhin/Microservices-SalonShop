package com.panhaphin.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;


import com.panhaphin.dto.SalonDTO;


@FeignClient("salon-service")
public interface  SalonFeignClient {

    @GetMapping("/api/salon/owner")
    public SalonDTO getSalonByOwnerId(
        
        @RequestHeader("Authorization")String jwt 
    ) throws Exception;
    
}
