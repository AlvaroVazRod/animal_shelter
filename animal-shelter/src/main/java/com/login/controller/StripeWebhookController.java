package com.login.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.login.model.Donation;
import com.login.model.Animal;
import com.login.model.User;
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
import java.util.Optional;

@RestController
@RequestMapping("/webhook")
@CrossOrigin
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
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
            if ("payment_intent.succeeded".equals(event.getType())) {
                JsonNode json = objectMapper.readTree(payload);
                JsonNode object = json.at("/data/object");
                String amountStr = object.get("amount").asText();

                Donation donation = new Donation();
                donation.setQuantity(Double.parseDouble(amountStr) / 100);
                
                donation.setPaymentMethod("stripe");
                donation.setDate(LocalDateTime.now());

                // Leer metadata opcional
                JsonNode metadata = object.get("metadata");
                if (metadata != null) {
                    if (metadata.has("id_user")) {
                        Long userId = metadata.get("id_user").asLong();
                        Optional<User> user = userRepository.findById(userId);
                        user.ifPresent(donation::setUser);
                    }
                    if (metadata.has("id_animal")) {
                        Long animalId = metadata.get("id_animal").asLong();
                        Optional<Animal> animal = animalRepository.findById(animalId);
                        animal.ifPresent(donation::setAnimal);
                    }
                }

                donationRepository.save(donation);
            }
        } catch (IOException | NullPointerException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al procesar JSON");
        }

        return ResponseEntity.ok("Webhook recibido");
    }
}

