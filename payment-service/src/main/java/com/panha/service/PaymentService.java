package com.panha.service;

import com.panha.domain.PaymentMethod;
import com.panha.model.PaymentOrder;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.payload.response.PaymentLinkResponse;

public interface PaymentService {

    PaymentLinkResponse createOrder(
            UserDTO user,
            BookingDTO booking,
            PaymentMethod paymentMethod
    );

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentId);

    String createStripePaymentLink(
            UserDTO user,
            Long amount,
            Long orderId
    );

    PaymentLinkResponse createBakongPaymentLink(
            UserDTO user,
            Long amount,
            Long orderId
    );

    Boolean proceedPayment(
            PaymentOrder paymentOrder,
            String paymentId,
            String paymentLinkId
    ) throws Exception;
}