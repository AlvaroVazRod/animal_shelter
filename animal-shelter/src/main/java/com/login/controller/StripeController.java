package com.login.controller;

import com.login.exception.ResourceNotFoundException;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin
public class StripeController {

    private final AnimalRepository animalRepository;

    public StripeController(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    @GetMapping("/sponsor-price/{animalId}")
    public ResponseEntity<Double> getSponsorPrice(@PathVariable Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        return ResponseEntity.ok(animal.getSponsorPrice());
    }
    
    @PostMapping("/sponsor-checkout/{animalId}")
    public ResponseEntity<Map<String, String>> createSponsorCheckoutSession(
            @PathVariable Long animalId,
            @RequestHeader("Authorization") String authHeader) throws StripeException {

        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));

        String priceId = animal.getStripePriceId();
        if (priceId == null || priceId.isBlank()) {
            throw new IllegalStateException("El animal no tiene un precio de Stripe asociado.");
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl("http://localhost:5173/success?sponsor=true")
                .setCancelUrl("http://localhost:5173/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build())
                .build();

        Session session = Session.create(params);
        return ResponseEntity.ok(Map.of("sessionId", session.getId())); // O usa session.getUrl() si prefieres redirigir manualmente
    }

}
