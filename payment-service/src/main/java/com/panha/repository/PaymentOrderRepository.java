package com.panha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.panha.model.PaymentOrder;

@Repository 

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    PaymentOrder findByPaymentLinkId(String paymentLinkId);
}