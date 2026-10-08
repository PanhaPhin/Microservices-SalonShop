package com.panha.mapper;

import com.panha.modal.Salon;
import com.panha.payload.dto.SalonDTO;

public class SalonMapper {
    public static SalonDTO mapToDTO(Salon salon){
        if (salon == null) return null;
        SalonDTO salonDTO = new SalonDTO();

        salonDTO.setId(salon.getId());
        salonDTO.setName(salon.getName());
        salonDTO.setDescription(salon.getDescription());
        salonDTO.setImage(salon.getImage());

        salonDTO.setAddress(salon.getAddress());
        salonDTO.setPhoneNumber(salon.getPhoneNumber());
        salonDTO.setEmail(salon.getEmail());
        salonDTO.setCity(salon.getCity());
        salonDTO.setPincode(salon.getPincode());

        salonDTO.setOwnerId(salon.getOwnerId());

        salonDTO.setOpenTime(salon.getOpenTime());
        salonDTO.setCloseTime(salon.getCloseTime());

        return salonDTO;
    }
}
