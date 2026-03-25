package com.panhaphin.controller;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panhaphin.modal.ServiceOffering;
import com.panhaphin.service.ServiceOfferingService;

@RestController
@RequestMapping("/api/service-offering")
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    public ServiceOfferingController(ServiceOfferingService serviceOfferingService) {
        this.serviceOfferingService = serviceOfferingService;
    }

    @GetMapping
    public ResponseEntity<Set<ServiceOffering>> getAllServices() {
        return ResponseEntity.ok(serviceOfferingService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOffering> getServiceById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(serviceOfferingService.getServiceById(id));
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<Set<ServiceOffering>> getServicesBySalonId(
            @PathVariable Long salonId,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(serviceOfferingService.getAllServiceBySalonId(salonId, categoryId));
    }

    @GetMapping("/multiple")
    public ResponseEntity<Set<ServiceOffering>> getServicesByIds(@RequestParam String ids) {
        Set<Long> idSet = Arrays.stream(ids.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toSet());
        return ResponseEntity.ok(serviceOfferingService.getServicesByIds(idSet));
    }
}