package com.panha.service.client;

import java.util.Set;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.panha.dto.ServiceDTO;

@FeignClient(name = "service-offering")
public interface ServiceOfferingFeignClient {

    @GetMapping("/api/service-offering/multiple")
    ResponseEntity<Set<ServiceDTO>> getServiceByIds(
        @RequestParam Set<Long> ids
    );
}
