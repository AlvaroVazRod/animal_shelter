package com.login.controller;

import com.login.config.StripeProperties;
import com.login.model.Donation;
import com.login.service.DonationService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/donaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping("/checkout")
    public Map<String, String> createCheckoutSession(
        @RequestBody Map<String, Object> data
    ) throws StripeException {
        Long amount = Long.valueOf(data.get("amount").toString());
        String successUrl = data.getOrDefault("success_url", "http://localhost:3000/success").toString();
        String cancelUrl = data.getOrDefault("cancel_url", "http://localhost:3000/cancel").toString();

        Map<String, String> metadata = new HashMap<>();
        if (data.containsKey("id_user")) {
            metadata.put("id_user", data.get("id_user").toString());
        }
        if (data.containsKey("id_animal")) {
            metadata.put("id_animal", data.get("id_animal").toString());
        }

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(successUrl)
            .setCancelUrl(cancelUrl)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount(amount * 100)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Donación a protectora")
                                    .build()
                            )
                            .build()
                    )
                    .build()
            )
            .putAllMetadata(metadata)
            .build();

        Session session = Session.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());
        response.put("sessionId", session.getId());
        return response;
    }

    @GetMapping
    public List<Donation> getFiltered(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Long userId
    ) {
        if (status != null && userId != null) {
            return donationService.findByStatusAndUser(status, userId);
        } else if (status != null) {
            return donationService.findByStatus(status);
        } else if (userId != null) {
            return donationService.findByUserId(userId);
        } else {
            return donationService.getAll();
        }
    }

    @GetMapping("/stripe/{stripeId}")
    public Optional<Donation> getByStripePaymentIntentId(@PathVariable String stripeId) {
        return donationService.findByStripePaymentIntentId(stripeId);
    }
}
