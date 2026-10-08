package com.panhaphin.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.panhaphin.dto.SalonDTO;
import com.panhaphin.modal.Category;
import com.panhaphin.respository.CategoryRepository;
import com.panhaphin.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private static final String UPLOAD_DIR =
            "uploads/categories/";

    @Override
    public Category saveCategory(
            Category category,
            MultipartFile image,
            SalonDTO salonDTO
    ) {

        if (salonDTO == null || salonDTO.getId() == null){
                throw new IllegalArgumentException(
                    "Salon ID is required"
            );
        }

        Category newCategory = new Category();

        newCategory.setName(
                category.getName()
        );

        newCategory.setSalonId(
                salonDTO.getId()
        );

        if (image != null && !image.isEmpty()) {

            try {

                Path uploadPath =
                        Paths.get(UPLOAD_DIR);

                Files.createDirectories(
                        uploadPath
                );

                String originalFileName =
                        image.getOriginalFilename();

                String extension = "";

                if (originalFileName != null
                        && originalFileName.contains(".")) {

                    extension =
                            originalFileName.substring(
                                    originalFileName.lastIndexOf(".")
                            );
                }

                String fileName =
                        UUID.randomUUID()
                                + extension;

                Path filePath =
                        uploadPath.resolve(
                                fileName
                        );

                Files.copy(
                        image.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                newCategory.setImage(
                        "/uploads/categories/"
                                + fileName
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to save category image",
                        e
                );
            }
        }

        return categoryRepository.save(
                newCategory
        );
    }

    @Override
    public Set<Category> getAllCategoriesBySalon(
            Long id
    ) {

        return categoryRepository.findBySalonId(
                id
        );
    }

    // ADMIN: get all categories
    @Override
    public Set<Category> getAllCategories() {

        return new HashSet<>(
                categoryRepository.findAll()
        );
    }

    @Override
    public Category getCategoryById(
            Long id
    ) throws Exception {

        Category category =
                categoryRepository
                        .findById(id)
                        .orElse(null);

        if (category == null) {

            throw new Exception(
                    "Category not found with id "
                            + id
            );
        }

        return category;
    }

    @Override
    public void deleteCategoryById(
            Long id,
            Long salonId
    ) throws Exception {

        Category category =
                getCategoryById(id);

        if (!category.getSalonId()
                .equals(salonId)) {

            throw new Exception(
                    "You don't have permission "
                            + "to delete this category"
            );
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public Category findByIdAndSalonId(
            Long id,
            Long salonId
    ) throws Exception {

        Category category =
                categoryRepository
                        .findByIdAndSalonId(
                                id,
                                salonId
                        );

        if (category == null) {

            throw new Exception(
                    "Category not found"
            );
        }

        return category;
    }

    @Override
    public Category updateCategory(
            Long id,
            Category category,
            MultipartFile image,
            Long salonId
    ) throws Exception {

        Category existingCategory =
                categoryRepository
                        .findByIdAndSalonId(
                                id,
                                salonId
                        );

        if (existingCategory == null) {

            throw new Exception(
                    "Category not found"
            );
        }

        existingCategory.setName(
                category.getName()
        );

        existingCategory.setImage(
                category.getImage()
        );

        return categoryRepository.save(
                existingCategory
        );
    }
}