package com.panhaphin.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panhaphin.modal.Category;
import java.util.Set;


public interface  CategoryRepository extends JpaRepository<Category, Long>{
    Set<Category> findBySalonId(Long salonId);
    
}
