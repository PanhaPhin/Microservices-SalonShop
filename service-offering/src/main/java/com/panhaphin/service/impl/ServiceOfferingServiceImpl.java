package com.panhaphin.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.panhaphin.dto.CategoryDTO;
import com.panhaphin.dto.SalonDTO;
import com.panhaphin.dto.ServiceDTO;
import com.panhaphin.modal.ServiceOffering;
import com.panhaphin.repository.ServiceOfferingRepository;
import com.panhaphin.service.ServiceOfferingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceOfferingServiceImpl implements ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;

    @Override
    public ServiceOffering createService(SalonDTO salonDto, ServiceDTO serviceDTO, CategoryDTO categoryDTO) {

        ServiceOffering serviceOffering = new ServiceOffering();
        
        serviceOffering.setName(serviceDTO.getName());
    serviceOffering.setDescription(serviceDTO.getDescription());
    serviceOffering.setPrice(serviceDTO.getPrice());
    serviceOffering.setDuration(serviceDTO.getDuration());
    serviceOffering.setImage(serviceDTO.getImage());

    serviceOffering.setCategoryId(categoryDTO.getId());
    serviceOffering.setSalonId(salonDto.getId());   // ✅ correct

    
        return serviceOfferingRepository.save(serviceOffering);
    }

    @Override
    public ServiceOffering updateService(Long serviceId, ServiceOffering service) throws Exception {
       
        ServiceOffering serviceOffering= serviceOfferingRepository.findById(serviceId).orElse(null);

        if (serviceOffering==null){
            throw new Exception("service not exist with id "+ serviceId);
        }

        serviceOffering.setImage(service.getImage());
        serviceOffering.setName(service.getName());
        serviceOffering.setDescription(service.getDescription());
        serviceOffering.setPrice(service.getPrice());
        serviceOffering.setDuration(service.getDuration());


        return serviceOfferingRepository.save(serviceOffering);
    }

    @Override
    public Set<ServiceOffering> getAllServiceBySalonId(Long salonId, Long categoryId) {
       Set<ServiceOffering> services= serviceOfferingRepository.findBySalonId(salonId);
       if(categoryId!=null){
        services=services.stream().filter((service)->service.getCategoryId() !=null &&
                service.getCategoryId()==categoryId).collect(Collectors.toSet());
       }
       return services;
    }

   @Override
public Set<ServiceOffering> getServicesByIds(Set<Long> ids) {

    List<ServiceOffering> services = serviceOfferingRepository.findAllById(ids);

    return new HashSet<>(services);
}

   @Override
   public ServiceOffering getServiceById(Long id) throws Exception {
    ServiceOffering serviceOffering=serviceOfferingRepository.findById(id).orElse(null);

    if(serviceOffering==null){
        throw new Exception("service not exist with id"+id);
    }
    return serviceOffering;
    
   }

   @Override
public Set<ServiceOffering> getAllServices() {
    // Fetch all services from the repository and return as a Set
    List<ServiceOffering> services = serviceOfferingRepository.findAll();
    return new HashSet<>(services);
}

    


}
   

    
   
    
