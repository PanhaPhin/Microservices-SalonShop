package com.panha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.panha.modal.Salon;
import com.panha.payload.dto.SalonDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.repositroy.SalonRespository;
import com.panha.service.SalonService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalonServiceImpl implements  SalonService {

    private final SalonRespository salonRespository;

    @Override
public Salon createSalon(SalonDTO req, UserDTO user) {
    Salon salon = new Salon();
    salon.setName(req.getName());
    salon.setAddress(req.getAddress());
    salon.setEmail(req.getEmail());
    salon.setCity(req.getCity());
    salon.setImage(req.getImage());
    salon.setOwnerId(user.getId());
    salon.setOpenTime(req.getOpenTime());
    salon.setPhoneNumber(req.getPhoneNumber());

    return salonRespository.save(salon);
}

    @Override
    public Salon updateSalon(SalonDTO salon, UserDTO user, Long salonId) throws Exception {
        Salon existingSalon = salonRespository.findById(salonId).orElse(null);
        if (!salon.getOwnerId().equals(user.getId())){
            throw new Exception("you don't have permission to update this salon");
        }

        
        if(existingSalon !=null ){
            existingSalon.setCity(salon.getCity());
            existingSalon.setName(salon.getName());
            existingSalon.setAddress(salon.getAddress());
            existingSalon.setEmail(salon.getEmail());
            existingSalon.setImage(salon.getImage());
            existingSalon.setOpenTime(salon.getOpenTime());
            existingSalon.setOwnerId(user.getId());
            existingSalon.setCloseTime(salon.getCloseTime());
            existingSalon.setPhoneNumber(salon.getPhoneNumber());

            return salonRespository.save(existingSalon);


        }


         throw new Exception("salon not exist");
    }

    @Override
    public List<Salon> getAllSalon() {
      return salonRespository.findAll();
    }

    @Override
    public Salon getSalonById(Long salonId) throws Exception {
        Salon salon=salonRespository.findById(salonId).orElse(null);
        if (salon==null){
            throw new Exception("salon not exist");

        }
        return salon;
    }

    @Override
    public Salon getSalonByOwnerId(Long ownerId) {
        return salonRespository.findByOwnerId(ownerId);
    }

    @Override
    public List<Salon> searchSalonByCity(String city) {
       return salonRespository.searchSalon(city);
    }
    
}
