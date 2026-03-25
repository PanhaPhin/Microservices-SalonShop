package com.panha.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.panha.domain.BookingStatus;
import com.panha.dto.BookingRequest;
import com.panha.dto.SalonDTO;
import com.panha.dto.ServiceDTO;
import com.panha.dto.UserDTO;
import com.panha.modal.Booking;
import com.panha.modal.SalonReport;



public interface  BookingService {

    Booking createBooking(BookingRequest booking, 
                          UserDTO ser,
                          SalonDTO salon,
                          Set<ServiceDTO> serviceDTOSet) throws Exception;

    List<Booking> getBookingsByCustomer(Long customerId);
    List<Booking> getBookingsBySalon(Long salonId);
    Booking getBookingById(Long id) throws Exception;
    Booking updateBooking(Long bookingId, BookingStatus status) throws Exception;

   List<Booking> getBookingsByDate(LocalDate date, Long salonId);
    SalonReport getSalonReport(Long salonId);
    
                   
    
}
