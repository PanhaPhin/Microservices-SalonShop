package com.panha.massaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Configuration;

import com.panha.model.Notification;
import com.panha.service.NotificationService;

import lombok.RequiredArgsConstructor;


@Configuration
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues= "notification-queue")
    public void sendNotificationEventConsumer(Notification notification) throws Exception{
        notificationService.createNotification(notification);
    }
    
}
