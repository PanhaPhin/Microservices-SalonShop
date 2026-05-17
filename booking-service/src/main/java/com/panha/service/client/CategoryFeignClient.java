package com.panha.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.panha.dto.CategoryDTO;


@FeignClient("category-service")
public interface CategoryFeignClient {


    @GetMapping("/api/categories/salon-owner/salon/{salonId}/category/{id}")
    public ResponseEntity<CategoryDTO> getCategoriesByIdAndSalon(
        @PathVariable Long id,
        @PathVariable Long salonId
    ) throws Exception;
}