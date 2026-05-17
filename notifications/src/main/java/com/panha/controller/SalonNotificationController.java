package com.panha.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.panha.Mapper.NotificationMapper;
import com.panha.model.Notification;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.NotificationDTO;
import com.panha.service.NotificationService;
import com.panha.service.client.BookingFeignClient;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications/salon-owner")
public class SalonNotificationController {

    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;


    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationBySalonId(
            @PathVariable Long salonId
    ) {
        List<Notification> notifications = notificationService
            .getAllNotificationsBySalonId(salonId);

        List<NotificationDTO> notificationDTOS = notifications.stream()
                .map((notification -> {
                    BookingDTO bookingDTO = null;

                    try {
                        bookingFeignClient.getBookingById(notification.getBookingId());

                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return NotificationMapper.toDTO(notification, bookingDTO);
                })).collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOS);

    }

}
