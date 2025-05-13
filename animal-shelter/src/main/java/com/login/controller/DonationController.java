package com.login.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/donaciones")
@CrossOrigin
public class DonationController {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @PostMapping("/checkout")
    public Map<String, String> createCheckoutSession(@RequestBody Map<String, Object> data) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

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
        return response;
    }
}
