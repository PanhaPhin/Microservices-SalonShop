package com.panha.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.panha.Mapper.NotificationMapper;
import com.panha.model.Notification;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.NotificationDTO;
import com.panha.repository.NotificationRepository;
import com.panha.service.NotificationService;
import com.panha.service.client.BookingFeignClient;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final BookingFeignClient bookingFeignClient;
    @Override
    public NotificationDTO createNotification(Notification notification) throws Exception {
       Notification savedNotification = notificationRepository.save(notification);

       BookingDTO bookingDTO = bookingFeignClient.getBookingById(savedNotification.getBookingId()).getBody();

       NotificationDTO notificationDTO = NotificationMapper.toDTO(savedNotification, bookingDTO);


       return notificationDTO;
    }
    @Override
    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
    @Override
    public List<Notification> getAllNotificationsBySalonId(Long salonId) {
        return notificationRepository.findBySalonId(salonId);
    }
    @Override
    public Notification markNotificationAsRead(Long notificationId) throws Exception {
        return notificationRepository.findById(notificationId).map(
            notification -> {
                notification.setIsRead(true);
                return notificationRepository.save(notification);
            }
        ).orElseThrow(()-> new Exception("Notification not found"));
    }
}
