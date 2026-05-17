package com.panha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panha.model.Review;


public interface  ReviewRepository extends JpaRepository<Review, Long> {


    List<Review> findBySalonId(Long salonId);
    
}
