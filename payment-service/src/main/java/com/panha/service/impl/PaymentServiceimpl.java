package com.panha.service.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.panha.domain.PaymentMethod;
import com.panha.domain.PaymentOrderStatus;
import com.panha.model.PaymentOrder;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.payload.response.PaymentLink;
import com.panha.payload.response.PaymentLinkResponse;
import com.panha.repository.PaymentOrderRepository;
import com.panha.service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceimpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${razorpay.api.key}")
    private String razorpayApiKey;

    @Value("${razorpay.api.secret}")
    private String razorpayApiSecret;

    @Value("${bakong.api.key}")
    private String bakongSecretKey;

    // ================= CREATE ORDER =================
    @Override
    public PaymentLinkResponse createOrder(UserDTO user, BookingDTO booking, PaymentMethod paymentMethod) {

        if (booking == null || booking.getTotalPrice() == null) {
            throw new IllegalArgumentException("Invalid booking data");
        }

        Long amount = booking.getTotalPrice();

        PaymentOrder order = new PaymentOrder();
        order.setAmount(amount);
        order.setPaymentMethod(paymentMethod);
        order.setBookingId(booking.getId());
        order.setSalonId(booking.getSalonId());

        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        return switch (paymentMethod) {

            case STRIPE -> {
                PaymentLinkResponse response = new PaymentLinkResponse();
                response.setAmount(amount);
                response.setMethod(paymentMethod);

                String stripeUrl = createStripePaymentLink(user, amount, savedOrder.getId());
                response.setUrl(stripeUrl);

                //later via DB
                response.setPaymentId(savedOrder.getId().toString());

                yield response;
            }

            case BAKONG -> {
                PaymentLinkResponse response = new PaymentLinkResponse();
                response.setAmount(amount);
                response.setMethod(paymentMethod);

                PaymentLink link = createBakongPaymentLink(user, amount, savedOrder.getId());
                response.setUrl(link.getUrl());
                response.setQrCode(link.getQrCode());
                response.setPaymentId(link.getPaymentId());

                yield response;
            }

            case RAZORPAY -> {
                PaymentLinkResponse response = new PaymentLinkResponse();
                response.setAmount(amount);
                response.setMethod(paymentMethod);

                PaymentLink link = createRazorpayPaymentLink(user, amount, savedOrder.getId());
                response.setPaymentId(link.getPaymentId());
                response.setPublicKey(razorpayApiKey);
                response.setUrl(link.getUrl());

                yield response;
            }

            default -> throw new IllegalArgumentException("Unsupported payment method");
        };
    }

    // ================= GET ORDER =================
    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentOrderRepository.findById(id)
                .orElseThrow(() -> new Exception("Pay order not found"));
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentId) {
        return paymentOrderRepository.findByPaymentLinkId(paymentId);
    }

    // ================= BAKONG =================
    @Override
    public PaymentLink createBakongPaymentLink(UserDTO user, Long amount, Long orderId) {
        PaymentLink link = new PaymentLink();
        link.setUrl("https://bakong.checkout/pay/" + orderId);
        link.setQrCode("BAKONG_QR_CODE_" + orderId);
        link.setPaymentId("BAKONG_REF_" + orderId);
        return link;
    }

   // ================= STRIPE =================
    @Override
public String createStripePaymentLink(UserDTO user, Long amount, Long orderId) {

    try {
        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:3000/payment-success/" + orderId)
                        .setCancelUrl("http://localhost:3000/payment/cancel")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(amount * 100)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Salon appointment booking")
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

       Session session = Session.create(params);

       // save sessionId to DB

       PaymentOrder order = paymentOrderRepository.findById(orderId).orElseThrow();
order.setExternalPaymentId(session.getId());
paymentOrderRepository.save(order);


        return  session.getUrl();

    } catch (Exception e) {
        throw new RuntimeException("Stripe payment error", e);
    }
}

    // ================= RAZORPAY =================
    @Override
    public PaymentLink createRazorpayPaymentLink(UserDTO user, Long amount, Long orderId) {

        try {
            Long finalAmount = amount * 100; // smallest currency unit

            RazorpayClient razorpay = new RazorpayClient(razorpayApiKey, razorpayApiSecret);

            JSONObject request = new JSONObject();
            request.put("amount", finalAmount);
            request.put("currency", "INR"); // Razorpay doesn't support KHR

            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullname());
            customer.put("email", user.getEmail());

            request.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("email", true);

            request.put("notify", notify);
            request.put("reminder_enable", true);

            request.put("callback_url", "http://localhost:3000/payment-success/" + orderId);
            request.put("callback_method", "get");

            com.razorpay.PaymentLink razorpayLink =
                    razorpay.paymentLink.create(request);

            PaymentLink link = new PaymentLink();
            link.setPaymentId(razorpayLink.get("id"));
            link.setUrl(razorpayLink.get("short_url"));

            return link;

        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay payment link", e);
        }
    }

    @Override
public Boolean proceedPayment(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException  {

    if (paymentOrder.getStatus() != PaymentOrderStatus.PENDING) {
        return false;
    }

    switch (paymentOrder.getPaymentMethod()) {

        case RAZORPAY -> {
            RazorpayClient razorpay = new RazorpayClient(razorpayApiKey, razorpayApiSecret);

            Payment payment = razorpay.payments.fetch(paymentId);
            String status = payment.get("status");

            if ("captured".equals(status)) {
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }
            return false;
        }

        case STRIPE -> {
    try {
        Stripe.apiKey = stripeSecretKey;

        Session session = Session.retrieve(paymentLinkId);

        if ("paid".equals(session.getPaymentStatus())) {
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrderRepository.save(paymentOrder);
            return true;
        }
        return false;

    } catch (Exception e) {
        throw new RuntimeException("Stripe verification failed", e);
    }
}

        case BAKONG -> {
        
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrderRepository.save(paymentOrder);
            return true;
        }

        default -> throw new IllegalArgumentException("Unsupported payment method");
    }
}
}