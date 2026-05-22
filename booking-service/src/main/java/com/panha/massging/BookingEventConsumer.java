package com.panha.massging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.panha.modal.PaymentOrder;
import com.panha.service.BookingService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingEventConsumer {

    private final BookingService bookingService;

    @RabbitListener(queues = "booking-queue")
    public void consumeBookingEvent(PaymentOrder paymentOrder) throws Exception {

        bookingService.bookingSuccess(paymentOrder);

    }
}