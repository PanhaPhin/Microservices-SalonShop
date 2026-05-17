package com.panha.Mapper;

import com.panha.model.Notification;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.NotificationDTO;

public class NotificationMapper {

    public static NotificationDTO toDTO(Notification notification , BookingDTO bookingDTO) {

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setType(notification.getType());
        notificationDTO.setDescription(notification.getDescription());
        notificationDTO.setIsRead(notification.getIsRead());
        notificationDTO.setUserId(notification.getUserId());
        notificationDTO.setSalonId(notification.getSalonId());
        notificationDTO.setCreatedAt(notification.getCreatedAt());
        notificationDTO.setBookingId(notification.getBookingId());

        return notificationDTO;





        
       
    }
    
}
