package com.login.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.login.model.Donation;
import com.login.repository.AnimalRepository;
import com.login.repository.DonationRepository;
import com.login.repository.UserRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/webhook")
@CrossOrigin
public class StripeWebhookController {

    @Value("${stripe.webhookSecret}")
    private String endpointSecret;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AnimalRepository animalRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        try {
            JsonNode json = objectMapper.readTree(payload);
            JsonNode object = json.at("/data/object");
            String stripePaymentIntentId = object.get("id").asText();
            String amountStr = object.has("amount") ? object.get("amount").asText() : "0";

            Donation donation = new Donation();
            donation.setStripePaymentIntentId(stripePaymentIntentId);
            donation.setPaymentMethod("stripe");
            donation.setDate(LocalDateTime.now());
            donation.setQuantity(Double.parseDouble(amountStr) / 100); // safe default

            Donation.Status status;

            switch (event.getType()) {
                case "payment_intent.succeeded":
                    status = Donation.Status.completed;
                    break;
                case "payment_intent.canceled":
                    status = Donation.Status.cancelled;
                    break;
                case "payment_intent.payment_failed":
                    status = Donation.Status.failed;
                    break;
                case "charge.refunded":
                    status = Donation.Status.refunded;
                    break;
                default:
                    return ResponseEntity.ok("Evento ignorado: " + event.getType());
            }

            donation.setStatus(status);

            // Leer metadata opcional
            JsonNode metadata = object.get("metadata");
            if (metadata != null) {
                if (metadata.has("id_user")) {
                    Long userId = metadata.get("id_user").asLong();
                    userRepository.findById(userId).ifPresent(donation::setUser);
                }
                if (metadata.has("id_animal")) {
                    Long animalId = metadata.get("id_animal").asLong();
                    animalRepository.findById(animalId).ifPresent(donation::setAnimal);
                }
            }

            donationRepository.save(donation);
            return ResponseEntity.ok("Webhook recibido | ID de Stripe: " + stripePaymentIntentId);

        } catch (IOException | NullPointerException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al procesar JSON");
        }
    }
}
