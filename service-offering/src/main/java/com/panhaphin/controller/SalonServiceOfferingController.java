package com.panhaphin.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panhaphin.dto.CategoryDTO;
import com.panhaphin.dto.SalonDTO;
import com.panhaphin.dto.ServiceDTO;
import com.panhaphin.modal.ServiceOffering;
import com.panhaphin.service.ServiceOfferingService;

@RestController
@RequestMapping("/api/service-offering/salon-owner")
public class SalonServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    public SalonServiceOfferingController(ServiceOfferingService serviceOfferingService) {
        this.serviceOfferingService = serviceOfferingService;
    }

    // Accept multiple services
    @PostMapping
    public ResponseEntity<List<ServiceOffering>> createServices(@RequestBody List<ServiceDTO> serviceDTOs) {

        List<ServiceOffering> offerings = new ArrayList<>();

        for (ServiceDTO serviceDTO : serviceDTOs) {
            SalonDTO salonDTO = new SalonDTO();
            salonDTO.setId(1L); // replace with logged-in salon ID

            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setId(serviceDTO.getCategory());

            ServiceOffering offering =
                    serviceOfferingService.createService(salonDTO, serviceDTO, categoryDTO);

            offerings.add(offering);
        }

        return ResponseEntity.ok(offerings);
    }

    // Update single service
    @PutMapping("/{id}")
    public ResponseEntity<ServiceOffering> updateService(
            @PathVariable Long id,
            @RequestBody ServiceOffering serviceOffering) throws Exception {

        ServiceOffering updatedService =
                serviceOfferingService.updateService(id, serviceOffering);

        return ResponseEntity.ok(updatedService);
    }
}