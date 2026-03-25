package com.panha.repositroy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.panha.modal.Salon;


public interface  SalonRespository extends  JpaRepository<Salon, Long> {

    Salon findByOwnerId(Long id);

    @Query("SELECT s FROM Salon s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Salon> searchSalon(@Param("keyword") String keyword);
    
}
