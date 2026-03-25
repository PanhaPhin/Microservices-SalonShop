package com.panhaphin.service;

import java.util.Set;

import com.panhaphin.dto.CategoryDTO;
import com.panhaphin.dto.SalonDTO;
import com.panhaphin.dto.ServiceDTO;
import com.panhaphin.modal.ServiceOffering;

public interface ServiceOfferingService {

    ServiceOffering createService(SalonDTO salonDto,
                                  ServiceDTO serviceDTO,
                                  CategoryDTO categoryDTO);

    ServiceOffering updateService(Long serviceId, ServiceOffering service) throws Exception;

    Set<ServiceOffering> getAllServiceBySalonId(Long salonId, Long categoryId);

    Set<ServiceOffering> getServicesByIds(Set<Long> ids);

    ServiceOffering getServiceById(Long id) throws Exception;

    // ✅ Add this method to get all services
    Set<ServiceOffering> getAllServices();
}