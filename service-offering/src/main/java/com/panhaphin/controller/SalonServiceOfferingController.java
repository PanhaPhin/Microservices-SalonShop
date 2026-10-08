package com.panhaphin.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/service-offerings/salon-owner")
@RequiredArgsConstructor
public class SalonServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;
    private final SalonFeignClient salonFeignClient;
    private final CategoryFeignClient categoryFeignClient;

    @GetMapping
    @PreAuthorize("hasRole('SALON_OWNER')")
    public ResponseEntity<Set<ServiceOffering>> getMyServices(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO
                = salonFeignClient.getSalonByOwnerId(jwt).getBody();

        return ResponseEntity.ok(
                serviceOfferingService.getAllServiceBySalonId(
                        salonDTO.getId(),
                        null
                )
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('SALON_OWNER')")
    public ResponseEntity<ServiceOffering> createService(
            @RequestBody ServiceDTO serviceDTO,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO
                = salonFeignClient.getSalonByOwnerId(jwt).getBody();

        CategoryDTO categoryDTO
                = categoryFeignClient.getCategoriesByIdAndSalon(
                        salonDTO.getId(),
                        serviceDTO.getCategory(),
                        jwt
                ).getBody();

        ServiceOffering offering
                = serviceOfferingService.createService(
                        salonDTO,
                        serviceDTO,
                        categoryDTO
                );

        return ResponseEntity.ok(offering);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SALON_OWNER')")
    public ResponseEntity<ServiceOffering> updateService(
            @PathVariable Long id,
            @RequestBody ServiceOffering serviceOffering,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        ServiceOffering updatedService
                = serviceOfferingService.updateService(
                        id,
                        serviceOffering
                );

        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SALON_OWNER')")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        serviceOfferingService.deleteService(id);

        return ResponseEntity.noContent().build();
    }
}
