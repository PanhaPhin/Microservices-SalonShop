package com.panha.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panha.mapper.SalonMapper;
import com.panha.modal.Salon;
import com.panha.payload.dto.SalonDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.service.SalonService;
import com.panha.service.client.UserFeignClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
public class SalonController {

    private final SalonService salonService;
    private final UserFeignClient userFeignClient;

    @PostMapping
    public ResponseEntity<SalonDTO> createSalon(
            @RequestBody SalonDTO salonDTO,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        Salon salon = salonService.createSalon(salonDTO, userDTO);

        SalonDTO response = SalonMapper.mapToDTO(salon);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{salonId}")
    public ResponseEntity<SalonDTO> updateSalon(
            @PathVariable Long salonId,
            @RequestBody SalonDTO salonDTO,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();

        System.out.println("--------" + salonId + "email" + salonDTO.getEmail());

        Salon salon = salonService.updateSalon(salonDTO, userDTO, salonId);
        SalonDTO response = SalonMapper.mapToDTO(salon);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SalonDTO>> getSalons() throws Exception {

        List<Salon> salons = salonService.getAllSalon();
        List<SalonDTO> salonDTOs = salons.stream()
                .map(SalonMapper::mapToDTO)
                .toList();

        return ResponseEntity.ok(salonDTOs);
    }

    @GetMapping("/{salonId}")
    public ResponseEntity<SalonDTO> getSalonById(
            @PathVariable Long salonId
    ) throws Exception {

        // UserDTO userDTO= new UserDTO();
        // userDTO.setId(1L);
        Salon salon = salonService.getSalonById(salonId);
        SalonDTO salonDTO = SalonMapper.mapToDTO(salon);

        return ResponseEntity.ok(salonDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SalonDTO>> searchSalons(
            @RequestParam("city") String city
    ) throws Exception {
        // UserDTO userDTO= new UserDTO();
        // userDTO.setId(1L);`
        List<Salon> salons = salonService.searchSalonByCity(city);

        List<SalonDTO> salonDTOs = salons.stream()
                .map(SalonMapper::mapToDTO)
                .toList();

        return ResponseEntity.ok(salonDTOs);
    }

    @GetMapping("/owner")
    public ResponseEntity<SalonDTO> getSalonByOwnerId(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        System.out.println("========== SALON OWNER API ==========");

        UserDTO userDTO
                = userFeignClient.getUserProfile(jwt).getBody();

        System.out.println("USER DTO = " + userDTO);

        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }

        System.out.println("OWNER ID = " + userDTO.getId());

        Salon salon
                = salonService.getSalonByOwnerId(userDTO.getId());

        System.out.println("SALON = " + salon);

        if (salon == null) {
            return ResponseEntity.notFound().build();
        }

        SalonDTO dto = SalonMapper.mapToDTO(salon);

        System.out.println("SALON DTO = " + dto);

        return ResponseEntity.ok(dto);
    }
}
