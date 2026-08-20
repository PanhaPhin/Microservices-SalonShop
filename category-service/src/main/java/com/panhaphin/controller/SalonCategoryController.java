package com.panhaphin.controller;

import java.util.Set;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping
    public ResponseEntity<Set<Category>> getMyCategories(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO
                = salonFeignClient.getSalonByOwnerId(jwt);

        Set<Category> categories
                = categoryService.getAllCategoriesBySalon(
                        salonDTO.getId()
                );

        return ResponseEntity.ok(categories);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Category> createCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        SalonDTO salonDTO
                = salonFeignClient.getSalonByOwnerId(jwt);

        Category category = new Category();
        category.setName(name);

        Category savedCategory
                = categoryService.saveCategory(
                        category,
                        image,
                        salonDTO
                );

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

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
        @PathVariable Long id,
        @RequestBody Category category,
        @RequestHeader("Authorization") String jwt
    ) throws Exception {
        SalonDTO salonDTO =
                salonFeignClient.getSalonByOwnerId(jwt);
        Category updatedCategory =
                categoryService.updateCategory(
                        id,
                        category,
                        salonDTO.getId()

                );
        return ResponseEntity.ok(updatedCategory);
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
