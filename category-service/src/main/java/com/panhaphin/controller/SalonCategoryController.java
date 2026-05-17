package com.panhaphin.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panhaphin.dto.SalonDTO;
import com.panhaphin.modal.Category;
import com.panhaphin.service.CategoryService;
import com.panhaphin.service.client.SalonFeignClient;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/categories/salon-owner")
public class SalonCategoryController {

    private final CategoryService categoryService;
    private final SalonFeignClient salonFeignClient;

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt);

        Category savedCategory = categoryService.saveCategory(category, salonDTO);

        return ResponseEntity.ok(savedCategory);
    }

    @GetMapping("/salon/{salonId}/category/{id}")
    public ResponseEntity<Category> getCategoriesByIdAndSalon(
            @PathVariable("id") Long id,
            @PathVariable("salonId") Long salonId
    ) throws Exception {

        Category category = categoryService.findByIdAndSalonId(id, salonId);

        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonByOwnerId(jwt);

        categoryService.deleteCategoryById(id, salonDTO.getId());

        return ResponseEntity.ok("Category deleted successfully");
    }
}
