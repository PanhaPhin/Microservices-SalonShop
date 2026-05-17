package com.panha.service.client;

import java.util.Set;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.panha.payload.dto.ServiceDTO;



@FeignClient("SERVICE-OFFERING")
public interface  ServiceOfferingFeignClient {

    @GetMapping("/api/service-offering/list/{ids}")
    public ResponseEntity<Set<ServiceDTO>> getServiceByIds(
        @PathVariable Set<Long> ids
    );


    
}
