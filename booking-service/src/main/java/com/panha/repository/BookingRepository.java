package com.panha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panha.modal.Booking;

public interface  BookingRepository extends  JpaRepository<Booking, Long>{

    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findBySalonId(Long salonId);
    
}
