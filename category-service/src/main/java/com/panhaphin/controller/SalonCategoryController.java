package com.panhaphin.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.panhaphin.dto.SalonDTO;
import com.panhaphin.modal.Category;
import com.panhaphin.service.CategoryService;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/categories/salon-owner")
public class SalonCategoryController {

    private final CategoryService categoryService;

    @PostMapping("")
    public ResponseEntity<Category> createCategory(
        @RequestBody Category category
    ){
        SalonDTO salonDTO=new SalonDTO();
        salonDTO.setId(1L);
        salonDTO.setName(category.getName());
        Category categories = categoryService.saveCategory(category, salonDTO);



        return ResponseEntity.ok(categories);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
        @PathVariable Long id
    ) throws Exception{
        SalonDTO salonDTO = new SalonDTO();
        salonDTO.setId(1L);

        categoryService.deleteCategoryById(id, salonDTO.getId());

        return ResponseEntity.ok(" Category Deleted successfully");
    }
}
