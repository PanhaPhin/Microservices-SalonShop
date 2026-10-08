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
public class SalonServiceImpl implements SalonService {

    private final SalonRespository salonRespository;

    @Override
    public Salon createSalon(SalonDTO req, UserDTO user) {

        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException(
                    "Authenticated user not found"
            );
        }

        Salon salon = new Salon();

        salon.setName(req.getName());
        salon.setDescription(req.getDescription());
        salon.setImage(req.getImage());
    

        salon.setAddress(req.getAddress());
        salon.setPhoneNumber(req.getPhoneNumber());
        salon.setEmail(req.getEmail());
        salon.setCity(req.getCity());
        salon.setPincode(req.getPincode());
        

        // Owner comes from authenticated user
        salon.setOwnerId(user.getId());

        salon.setOpenTime(req.getOpenTime());
        salon.setCloseTime(req.getCloseTime());

        return salonRespository.save(salon);
    }

    @Override
    public Salon updateSalon(
            SalonDTO req,
            UserDTO user,
            Long salonId
    ) throws Exception {

        Salon existingSalon =
                salonRespository.findById(salonId)
                        .orElseThrow(() ->
                                new Exception(
                                        "Salon does not exist"
                                )
                        );

        if (user == null || user.getId() == null) {
            throw new Exception(
                    "Authenticated user not found"
            );
        }

        // Only the owner can update the salon
        if (!existingSalon.getOwnerId()
                .equals(user.getId())) {

            throw new Exception(
                    "You don't have permission to update this salon"
            );
        }

        existingSalon.setName(req.getName());
        existingSalon.setDescription(req.getDescription());
        existingSalon.setImage(req.getImage());

        existingSalon.setAddress(req.getAddress());
        existingSalon.setPhoneNumber(req.getPhoneNumber());
        existingSalon.setEmail(req.getEmail());
        existingSalon.setCity(req.getCity());
        existingSalon.setPincode(req.getPincode());

        existingSalon.setOpenTime(req.getOpenTime());
        existingSalon.setCloseTime(req.getCloseTime());

        return salonRespository.save(existingSalon);
    }


    @Override
    public List<Salon> getAllSalon() {
        return salonRespository.findAll();
    }

    @Override
    public Salon getSalonById(Long salonId) throws Exception {

        return salonRespository
                .findById(salonId)
                .orElseThrow(() ->
                        new Exception("Salon does not exist")
                );
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