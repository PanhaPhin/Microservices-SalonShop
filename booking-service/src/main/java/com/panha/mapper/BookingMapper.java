package com.panha.mapper;

import com.panha.dto.BookingDTO;
import com.panha.modal.Booking;

public class BookingMapper {

    public static BookingDTO toDTO(Booking booking){
        BookingDTO bookingDTO= new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setCustomerId(booking.getCustomerId());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setEndTime(booking.getEndTime());
        bookingDTO.setStarTime(booking.getStartTime());
        bookingDTO.setSalonId(booking.getSalonId());
        bookingDTO.setServiceIds(booking.getServiceIds());

        return bookingDTO;
    }
    
}
