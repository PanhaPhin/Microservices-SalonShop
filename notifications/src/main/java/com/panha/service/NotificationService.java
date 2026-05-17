package com.panha.service;

import java.util.List;

import com.panha.model.Notification;
import com.panha.payload.dto.NotificationDTO;


public interface  NotificationService {

    NotificationDTO createNotification(Notification notification) throws Exception;
    List<Notification> getAllNotificationsByUserId(Long userId);
    List<Notification> getAllNotificationsBySalonId(Long salonId);
    Notification markNotificationAsRead(Long notificationId) throws Exception;
    
}
