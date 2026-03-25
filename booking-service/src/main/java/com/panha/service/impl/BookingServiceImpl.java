package com.panha.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.panha.domain.BookingStatus;
import com.panha.dto.BookingRequest;
import com.panha.dto.SalonDTO;
import com.panha.dto.ServiceDTO;
import com.panha.dto.UserDTO;
import com.panha.modal.Booking;
import com.panha.modal.SalonReport;
import com.panha.repository.BookingRepository;
import com.panha.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(BookingRequest booking, 
                                 UserDTO ser, SalonDTO salon, 
                                 Set<ServiceDTO> serviceDTOSet) throws Exception {
            int totalDuration = serviceDTOSet.stream()
                             .mapToInt(ServiceDTO::getDuration)
                             .sum();

            LocalDateTime bookingStartTime=booking.getStartTime();
            LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(totalDuration);

            Boolean isSlotAvailable=isTimeSlotAvailable(salon, bookingStartTime, bookingEndTime);

            int totalPrice=serviceDTOSet.stream()
                 .mapToInt(ServiceDTO::getPrice)
                 .sum();

            Set<Long> idList=serviceDTOSet.stream()
                     .map(ServiceDTO::getId)
                     .collect(Collectors.toSet());

            Booking newBooking=new Booking();
            newBooking.setCustomerId(ser.getId());
            newBooking.setSalonId(salon.getId());
            newBooking.setServiceIds(idList);
            newBooking.setStatus(BookingStatus.PENDING);
            newBooking.setStartTime(bookingStartTime);
            newBooking.setEndTime(bookingEndTime);
            newBooking.setTotalPrice(totalPrice);



        return bookingRepository.save(newBooking);
    }

    public Boolean isTimeSlotAvailable(SalonDTO salonDTO,
                                       LocalDateTime bookingStartTime,
                                       LocalDateTime bookingEndTime) throws Exception{

        List<Booking> existingBookings=getBookingsBySalon(salonDTO.getId());


    LocalDateTime salonOpenTimes= salonDTO.getOpenTime().atDate(bookingStartTime.toLocalDate());
    LocalDateTime salonCloseTime= salonDTO.getCloseTime().atDate(bookingStartTime.toLocalDate());

    if(bookingStartTime.isBefore(salonOpenTimes) 
            || bookingEndTime.isAfter(salonCloseTime)){
                throw new Exception("Booking time must be within salon's working hours");
            }

            for(Booking existingBooking: existingBookings){

                LocalDateTime existingBookingStartTime=existingBooking.getStartTime();
                LocalDateTime existingBookingEndTime=existingBooking.getEndTime();

                if(bookingStartTime.isBefore(existingBookingEndTime )&& bookingEndTime.isAfter(existingBookingStartTime)){
                    throw new Exception("slot not available, choose different time ");
                
                }
                if(bookingStartTime.isEqual(existingBookingStartTime) || bookingEndTime.isEqual(existingBookingEndTime)){
                    throw new Exception("slot not available, choose different time ");
                }

            }

    return true;

    }




    @Override
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Booking> getBookingsBySalon(Long salonId) {
        return bookingRepository.findBySalonId(salonId);
    }

    @Override
public Booking getBookingById(Long id) throws Exception {
    Booking booking = bookingRepository.findById(id).orElse(null);
    if (booking == null) {
        throw new Exception("Booking not found");
    }
    return booking;
}
    @Override
    public Booking updateBooking(Long bookingId, BookingStatus status) throws Exception {

       Booking booking=getBookingById(bookingId);
       booking.setStatus(status);
       
       return bookingRepository.save(booking);
    }



    @Override
public SalonReport getSalonReport(Long salonId) {
    List<Booking> bookings = getBookingsBySalon(salonId);

    Double totalEarnings = bookings.stream()
            .mapToDouble(Booking::getTotalPrice)
            .sum();

    Integer totalBooking = bookings.size();

    List<Booking> cancelledBookings = bookings.stream()
            .filter(b -> b.getStatus().equals(BookingStatus.CANCELLED))
            .collect(Collectors.toList());

    Double totalRefund = cancelledBookings.stream()
            .mapToDouble(Booking::getTotalPrice)
            .sum();

    SalonReport report = new SalonReport();
    report.setSalonId(salonId);
    report.setCancelledBookings(cancelledBookings.size());
    report.setTotalBookings(totalBooking);
    report.setTotalEarnings(totalEarnings);
    report.setTotalRefund(totalRefund);

    return report;
}

    @Override
    public List<Booking> getBookingsByDate(LocalDate date, Long salonId) {
        List<Booking> allBookings=getBookingsBySalon(salonId);

        if(date==null){
            return allBookings;
        }

          return  allBookings.stream()
                 .filter(booking-> isSameDate(booking.getStartTime(),date) || 
                 isSameDate(booking.getEndTime(),date))
                 .collect(Collectors.toList());

    }

    private boolean isSameDate(LocalDateTime dateTime, LocalDate date) {
        return dateTime.toLocalDate().isEqual(date);
    }
    
}
