package com.panha.service;

import java.util.List;

import com.panha.modal.Salon;
import com.panha.payload.dto.SalonDTO;
import com.panha.payload.dto.UserDTO;

public interface  SalonService {
    Salon createSalon(SalonDTO salon, UserDTO user);
    Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception;
    List<Salon>getAllSalon();
    Salon getSalonById(Long salonId) throws Exception;
    Salon getSalonByOwnerId(Long ownerId);
    List<Salon> searchSalonByCity(String city);
    
}
