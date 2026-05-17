package com.panha.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.panha.payload.dto.BookingDTO;

@FeignClient("BOOKING-SERVICE")
public interface  BookingFeignClient {

    @GetMapping("/api/bookings/{bookingId}")

    public ResponseEntity<BookingDTO> getBookingById(
        @PathVariable Long bookingId
    ) throws Exception;

    
}
