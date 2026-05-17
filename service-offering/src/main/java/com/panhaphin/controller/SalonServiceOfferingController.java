package com.panhaphin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panhaphin.dto.CategoryDTO;
import com.panhaphin.dto.SalonDTO;
import com.panhaphin.dto.ServiceDTO;
import com.panhaphin.modal.ServiceOffering;
import com.panhaphin.service.ServiceOfferingService;
import com.panhaphin.service.client.CategoryFeignClient;
import com.panhaphin.service.client.SalonFeignClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/service-offerings")
@RequiredArgsConstructor
public class SalonServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;
    private final SalonFeignClient salonFeignClient;
    private final CategoryFeignClient categoryFeignClient;

    @PostMapping
    public ResponseEntity<ServiceOffering> createService(
            @RequestBody ServiceDTO serviceDTO,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt).getBody();

        CategoryDTO categoryDTO = categoryFeignClient.getCategoriesByIdAndSalon(serviceDTO.getCategory(), salonDTO.getId()).getBody();

        ServiceOffering offering
                = serviceOfferingService.createService(salonDTO, serviceDTO, categoryDTO);

        return ResponseEntity.ok(offering);
    }

    // Update single service
    @PutMapping("/{id}")
    public ResponseEntity<ServiceOffering> updateService(
            @PathVariable Long id,
            @RequestBody ServiceOffering serviceOffering) throws Exception {

        ServiceOffering updatedService
                = serviceOfferingService.updateService(id, serviceOffering);

        return ResponseEntity.ok(updatedService);
    }
}
