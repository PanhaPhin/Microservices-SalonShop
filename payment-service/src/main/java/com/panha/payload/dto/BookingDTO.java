package com.panha.payload.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.panha.domain.BookingStatus;

import lombok.Data;

@Data
public class BookingDTO {

    private Long id;

    private Long salonId;

    private Long customerId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    private Set<Long> serviceIds;

    private BookingStatus status;

    private Long totalPrice;
}