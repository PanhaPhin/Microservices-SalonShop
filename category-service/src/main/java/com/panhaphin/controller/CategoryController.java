package com.panhaphin.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panhaphin.modal.Category;
import com.panhaphin.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Get all categories by salon
    @PreAuthorize("hasAnyRole('SALON_OWNER', 'ADMIN', 'CUSTOMER')")
    @GetMapping("/salon/{salonId}")
    public ResponseEntity<Set<Category>> getCategoriesBySalon(
            @PathVariable Long salonId) {

        Set<Category> categories = categoryService.getAllCategoriesBySalon(salonId);
        return ResponseEntity.ok(categories);
    }

    // Get category by category ID
    @PreAuthorize("hasAnyRole('SALON_OWNER', 'ADMIN', 'CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id) throws Exception {

        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    



}
