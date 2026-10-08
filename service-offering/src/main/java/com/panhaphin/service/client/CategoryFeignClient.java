package com.panhaphin.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.panhaphin.dto.CategoryDTO;

@FeignClient(name = "category-service")
public interface CategoryFeignClient {

     @GetMapping("/api/categories/salon-owner/salon/{salonId}/category/{id}")
    ResponseEntity<CategoryDTO> getCategoriesByIdAndSalon(
            @PathVariable("salonId") Long salonId,
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String jwt
    );
}