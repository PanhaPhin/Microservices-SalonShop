package com.panha.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.panha.domain.PaymentMethod;
import com.panha.domain.PaymentOrderStatus;
import com.panha.model.PaymentOrder;
import com.panha.payload.dto.BookingDTO;
import com.panha.payload.dto.UserDTO;
import com.panha.payload.response.PaymentLinkResponse;
import com.panha.repository.PaymentOrderRepository;
import com.panha.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import kh.gov.nbc.bakong_khqr.BakongKHQR;
import kh.gov.nbc.bakong_khqr.model.IndividualInfo;
import kh.gov.nbc.bakong_khqr.model.KHQRCurrency;
import kh.gov.nbc.bakong_khqr.model.KHQRData;
import kh.gov.nbc.bakong_khqr.model.KHQRResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceimpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // ================= STRIPE =================
    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    // ================= BAKONG =================
    @Value("${bakong.khqr.account-id}")
    private String bakongAccountId;

    @Value("${bakong.khqr.account-number}")
    private String bakongAccountNumber;

    @Value("${bakong.khqr.bank-name}")
    private String bakongBankName;

    @Value("${bakong.api.token}")
    private String bakongToken;

    @Value("${bakong.api.base-url}")
    private String bakongApiUrl;

    // ================= CREATE ORDER =================
    @Override
    public PaymentLinkResponse createOrder(
            UserDTO user,
            BookingDTO booking,
            PaymentMethod paymentMethod
    ) {

        // 🔥 VALIDATION
        if (booking == null || booking.getTotalPrice() == null) {
            throw new IllegalArgumentException("Invalid booking data");
        }

        Long amount = booking.getTotalPrice();

        PaymentOrder order = new PaymentOrder();

        order.setAmount(amount);
        order.setPaymentMethod(paymentMethod);
        order.setBookingId(booking.getId());
        order.setSalonId(booking.getSalonId());
        order.setUserId(user.getId());
        order.setStatus(PaymentOrderStatus.PENDING);

        // 🔥 FIX: MUST SET BEFORE SAVE
        order.setPaymentLinkId("INIT-" + System.currentTimeMillis());

        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        return switch (paymentMethod) {

            // ================= STRIPE =================
            case STRIPE -> {

                PaymentLinkResponse response = new PaymentLinkResponse();

                response.setUrl(
                        createStripePaymentLink(
                                user,
                                amount,
                                savedOrder.getId()
                        )
                );

                response.setAmount(amount);
                response.setMethod(paymentMethod);
                response.setPaymentId(savedOrder.getId().toString());

                // optional improvement
                savedOrder.setPaymentLinkId(response.getPaymentId());
                paymentOrderRepository.save(savedOrder);

                yield response;
            }

            // ================= BAKONG =================
            case BAKONG -> {

                PaymentLinkResponse response
                        = createBakongPaymentLink(
                                user,
                                amount,
                                savedOrder.getId()
                        );

                response.setAmount(amount);
                response.setMethod(paymentMethod);

                // optional improvement
                savedOrder.setPaymentLinkId(savedOrder.getId().toString());
                paymentOrderRepository.save(savedOrder);

                yield response;
            }

            default ->
                throw new IllegalArgumentException(
                        "Unsupported payment method"
                );
        };
    }

    // ================= CREATE BAKONG QR =================
    @Override
    public PaymentLinkResponse createBakongPaymentLink(
            UserDTO user,
            Long amount,
            Long orderId
    ) {

        try {

            IndividualInfo info = new IndividualInfo();

            // Merchant Info
            info.setBakongAccountId(
                    bakongAccountId
            );

            info.setAccountInformation(
                    bakongAccountNumber
            );

            info.setAcquiringBank(
                    bakongBankName
            );

            // Currency & Amount
            info.setCurrency(
                    KHQRCurrency.KHR
            );

            info.setAmount(
                    amount.doubleValue()
            );

            // Merchant Detail
            info.setMerchantName(
                    "Sopanha Phin"
            );

            info.setMerchantCity(
                    "PHNOM PENH"
            );

            // Transaction Detail
            info.setBillNumber(
                    orderId.toString()
            );

            info.setMobileNumber(
                    bakongAccountNumber
            );

            info.setStoreLabel(
                    "Booking"
            );

            info.setTerminalLabel(
                    "Web"
            );

            info.setPurposeOfTransaction(
                    "Salon Booking"
            );

            // 5 minutes expiry
            info.setExpirationTimestamp(
                    System.currentTimeMillis() + 300000
            );

            // Generate KHQR
            KHQRResponse<KHQRData> response
                    = BakongKHQR.generateIndividual(info);

            if (response.getKHQRStatus().getCode() != 0) {

                throw new RuntimeException(
                        response.getKHQRStatus().getMessage()
                );
            }

            KHQRData data = response.getData();

            PaymentOrder order
                    = paymentOrderRepository
                            .findById(orderId)
                            .orElseThrow();

            // Save md5 transaction id
            order.setExternalPaymentId(
                    data.getMd5()
            );

            order.setStatus(
                    PaymentOrderStatus.PENDING
            );

            paymentOrderRepository.save(order);

            PaymentLinkResponse res
                    = new PaymentLinkResponse();

            // QR String
            res.setQrCode(
                    data.getQr()
            );

            // md5
            res.setPaymentId(
                    data.getMd5()
            );

            return res;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Bakong QR generation failed",
                    e
            );
        }
    }

    // ================= STRIPE PAYMENT =================
    @Override
    public String createStripePaymentLink(
            UserDTO user,
            Long amount,
            Long orderId
    ) {

        try {

            Stripe.apiKey = stripeSecretKey;

            SessionCreateParams params
                    = SessionCreateParams.builder()
                            .setMode(
                                    SessionCreateParams.Mode.PAYMENT
                            )
                            .setSuccessUrl(
                                    "http://localhost:3000/success/"
                                    + orderId
                            )
                            .setCancelUrl(
                                    "http://localhost:3000/cancel"
                            )
                            .addPaymentMethodType(
                                    SessionCreateParams.PaymentMethodType.CARD
                            )
                            .addLineItem(
                                    SessionCreateParams.LineItem
                                            .builder()
                                            .setQuantity(1L)
                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData
                                                            .builder()
                                                            .setCurrency("usd")
                                                            .setUnitAmount(
                                                                    amount * 100
                                                            )
                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData
                                                                            .builder()
                                                                            .setName(
                                                                                    "Booking Service"
                                                                            )
                                                                            .build()
                                                            )
                                                            .build()
                                            )
                                            .build()
                            )
                            .build();

            Session session
                    = Session.create(params);

            PaymentOrder order
                    = paymentOrderRepository
                            .findById(orderId)
                            .orElseThrow();

            order.setExternalPaymentId(
                    session.getId()
            );

            paymentOrderRepository.save(order);

            return session.getUrl();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Stripe payment failed",
                    e
            );
        }
    }

    // ================= GET ORDER =================
    @Override
    public PaymentOrder getPaymentOrderById(
            Long id
    ) throws Exception {

        return paymentOrderRepository
                .findById(id)
                .orElseThrow(()
                        -> new Exception("Order not found")
                );
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(
            String paymentId
    ) {

        return paymentOrderRepository
                .findByPaymentLinkId(paymentId);
    }

    // ================= VERIFY PAYMENT =================
    @Override
    public Boolean proceedPayment(
            PaymentOrder paymentOrder,
            String paymentId,
            String paymentLinkId
    ) {

        if (paymentOrder.getStatus()
                != PaymentOrderStatus.PENDING) {

            return false;
        }

        switch (paymentOrder.getPaymentMethod()) {

            // ================= VERIFY BAKONG =================
            case BAKONG -> {

                try {

                    String url
                            = bakongApiUrl
                            + "/v1/check_transaction_by_md5";

                    HttpHeaders headers
                            = new HttpHeaders();

                    headers.setContentType(
                            MediaType.APPLICATION_JSON
                    );

                    headers.setBearerAuth(
                            bakongToken
                    );

                    Map<String, Object> body
                            = new HashMap<>();

                    body.put(
                            "md5",
                            paymentLinkId
                    );

                    HttpEntity<Map<String, Object>> request
                            = new HttpEntity<>(
                                    body,
                                    headers
                            );

                    ResponseEntity<Map> response
                            = restTemplate.exchange(
                                    url,
                                    HttpMethod.POST,
                                    request,
                                    Map.class
                            );

                    Map responseBody
                            = response.getBody();

                    if (responseBody == null) {
                        return false;
                    }

                    Map data
                            = (Map) responseBody.get("data");

                    if (data == null) {
                        return false;
                    }

                    Boolean paid
                            = (Boolean) data.get("paid");

                    if (Boolean.TRUE.equals(paid)) {

                        paymentOrder.setStatus(
                                PaymentOrderStatus.SUCCESS
                        );

                        paymentOrderRepository
                                .save(paymentOrder);

                        return true;
                    }

                    return false;

                } catch (Exception e) {

                    throw new RuntimeException(
                            "Bakong verification failed",
                            e
                    );
                }
            }

            // ================= VERIFY STRIPE =================
            case STRIPE -> {

                try {

                    Stripe.apiKey
                            = stripeSecretKey;

                    Session session
                            = Session.retrieve(
                                    paymentLinkId
                            );

                    if ("paid".equals(
                            session.getPaymentStatus()
                    )) {

                        paymentOrder.setStatus(
                                PaymentOrderStatus.SUCCESS
                        );

                        paymentOrderRepository
                                .save(paymentOrder);

                        return true;
                    }

                    return false;

                } catch (Exception e) {

                    throw new RuntimeException(
                            "Stripe verification failed",
                            e
                    );
                }
            }

            default ->
                throw new IllegalArgumentException(
                        "Unsupported method"
                );
        }
    }
}
