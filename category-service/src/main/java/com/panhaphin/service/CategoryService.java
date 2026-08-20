package com.panhaphin.service;

import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.panhaphin.dto.SalonDTO;
import com.panhaphin.modal.Category;

public interface CategoryService {

    Category saveCategory(
            Category category,
            MultipartFile image,
            SalonDTO salonDTO
    );

    Category updateCategory(
            Long id,
            Category category,
            Long salonId
    ) throws Exception;

    Set<Category> getAllCategoriesBySalon(Long id);

    Category getCategoryById(Long id) throws Exception;

    void deleteCategoryById(Long id, Long salonId) throws Exception;

    Category findByIdAndSalonId(Long id, Long salonId) throws Exception;
}
