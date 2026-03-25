package com.panha.service;

import com.panha.domain.PaymentMethod;
import com.panha.model.PaymentOrder;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.payload.response.PaymentLink;
import com.panha.payload.response.PaymentLinkResponse;
import com.razorpay.RazorpayException;

public interface  PaymentService {

    PaymentLinkResponse createOrder(UserDTO user,
                                   BookingDTO booking,
                                   PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentId);

    PaymentLink createBakongPaymentLink(UserDTO user,
                                        Long amount,
                                        Long orderId);

    String createStripePaymentLink(UserDTO user,
                                   Long amount,
                                   Long orderId);
    
    PaymentLink createRazorpayPaymentLink(UserDTO user, Long amount, Long orderId);


    Boolean proceedPayment(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException;


                                   
    
    
}
