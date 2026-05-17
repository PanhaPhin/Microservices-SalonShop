package com.panha.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody Notification notification
    ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationByUserId(
            @PathVariable Long userId
    ) {
        List<Notification> notifications = notificationService.getAllNotificationsByUserId(userId);

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

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(
            @PathVariable Long notificationId
    ) throws Exception {

        Notification notification
                = notificationService.markNotificationAsRead(notificationId);

        BookingDTO bookingDTO
                = bookingFeignClient.getBookingById(notification.getBookingId()).getBody();

        return ResponseEntity.ok(
                NotificationMapper.toDTO(notification, bookingDTO)
        );
    }

}
