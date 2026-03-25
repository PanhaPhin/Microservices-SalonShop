package com.panhaphin.service;

import java.util.Set;

import com.panhaphin.modal.Category;
import com.panhaphin.dto.SalonDTO;

public interface CategoryService {

    Category saveCategory(Category category, SalonDTO salonDTO);

    Set<Category> getAllCategoriesBySalon(Long id);

    Category getCategoryById(Long id) throws Exception;

    void deleteCategoryById(Long id, Long salonId) throws Exception;
}