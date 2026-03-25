package com.panhaphin.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.panhaphin.modal.Category;
import com.panhaphin.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Get all categories by salon
    @GetMapping("/salon/{salonId}")
    public ResponseEntity<Set<Category>> getCategoriesBySalon(
            @PathVariable Long salonId) {

        Set<Category> categories = categoryService.getAllCategoriesBySalon(salonId);
        return ResponseEntity.ok(categories);
    }

    // Get category by category ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id) throws Exception {

        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

}