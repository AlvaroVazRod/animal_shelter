package com.login.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.login.model.Animal;
import com.login.model.Donation;
import com.login.model.Sponsor;
import com.login.model.User;
import com.login.model.WebhookLog;
import com.login.repository.AnimalRepository;
import com.login.repository.DonationRepository;
import com.login.repository.SponsorRepository;
import com.login.repository.UserRepository;
import com.login.repository.WebhookLogRepository;
import com.login.service.EmailService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
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

    @Value("${stripe.webhookSecret}")
    private String endpointSecret;

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;
    private final WebhookLogRepository webhookLogRepository;
    private final SponsorRepository sponsorRepository;
    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StripeWebhookController(DonationRepository donationRepository,
                                   UserRepository userRepository,
                                   AnimalRepository animalRepository,
                                   WebhookLogRepository webhookLogRepository,
                                   SponsorRepository sponsorRepository,
                                   EmailService emailService) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.animalRepository = animalRepository;
        this.webhookLogRepository = webhookLogRepository;
        this.sponsorRepository = sponsorRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        WebhookLog log = new WebhookLog();
        log.setReceivedAt(LocalDateTime.now());
        log.setEventType(event.getType());
        log.setRawPayload(payload);
        webhookLogRepository.save(log);

        try {
            JsonNode json = objectMapper.readTree(payload);
            JsonNode object = json.at("/data/object");

            if ("checkout.session.completed".equals(event.getType())) {
                String mode = object.get("mode").asText();
                if ("subscription".equals(mode)) {
                    String stripeSessionId = object.get("id").asText();
                    String customerEmail = object.get("customer_email").asText();
                    String clientReferenceId = object.has("client_reference_id") ? object.get("client_reference_id").asText() : null;

                    if (clientReferenceId != null && customerEmail != null) {
                        Long animalId = Long.parseLong(clientReferenceId);
                        Optional<User> userOpt = userRepository.findByEmail(customerEmail);
                        Optional<Animal> animalOpt = animalRepository.findById(animalId);

                        if (userOpt.isPresent() && animalOpt.isPresent()) {
                            boolean exists = sponsorRepository.existsByStripeRef(stripeSessionId);
                            if (!exists) {
                                Sponsor sponsor = new Sponsor();
                                sponsor.setStripeRef(stripeSessionId);
                                sponsor.setStatus(Sponsor.Status.completed);
                                sponsor.setQuantity(animalOpt.get().getSponsorPrice());
                                sponsor.setIdUser(userOpt.get());
                                sponsor.setIdAnimal(animalOpt.get());
                                sponsorRepository.save(sponsor);
                            }
                        }
                    }
                }
            }

            if (event.getType().startsWith("invoice.")) {
                String subscriptionId = object.get("subscription").asText();
                String invoiceStatus = object.get("status").asText();
                double amountPaid = object.has("amount_paid") ? object.get("amount_paid").asDouble() / 100.0 : 0.0;

                Sponsor.Status status;
                switch (invoiceStatus) {
                    case "paid" -> status = Sponsor.Status.completed;
                    case "unpaid", "incomplete", "past_due" -> status = Sponsor.Status.failed;
                    case "canceled" -> status = Sponsor.Status.cancelled;
                    default -> status = Sponsor.Status.failed;
                }

                sponsorRepository.findByStripeRef(subscriptionId).ifPresent(sponsor -> {
                    sponsor.setStatus(status);
                    sponsor.setQuantity(amountPaid);
                    sponsorRepository.save(sponsor);

                    if (status == Sponsor.Status.cancelled || status == Sponsor.Status.failed) {
                        User user = sponsor.getIdUser();
                        if (user != null && user.getEmail() != null) {
                            String subject = "Tu apadrinamiento ha sido " + (status == Sponsor.Status.cancelled ? "cancelado" : "fallido");
                            String body = "Hola " + user.getName() + ",\n\n" +
                                    "Te informamos que tu suscripción de apadrinamiento ha sido " +
                                    (status == Sponsor.Status.cancelled ? "cancelada." : "fallida.") +
                                    "\nPor favor revisa tu método de pago o contacta con nosotros si fue un error.\n\nGracias por tu apoyo.";
                            emailService.sendSimpleMessage(user.getEmail(), subject, body);
                        }
                    }
                });
            }

            String stripePaymentIntentId = object.get("id").asText();
            String amountStr = object.has("amount") ? object.get("amount").asText() : "0";

            if (donationRepository.findByStripePaymentIntentId(stripePaymentIntentId).isPresent()) {
                return ResponseEntity.ok("Evento duplicado ignorado: " + stripePaymentIntentId);
            }

            Donation donation = new Donation();
            donation.setStripePaymentIntentId(stripePaymentIntentId);
            donation.setPaymentMethod("stripe");
            donation.setDate(LocalDateTime.now());
            donation.setQuantity(Double.parseDouble(amountStr) / 100);

            Donation.Status status;
            switch (event.getType()) {
                case "payment_intent.succeeded" -> status = Donation.Status.completed;
                case "payment_intent.canceled" -> status = Donation.Status.cancelled;
                case "payment_intent.payment_failed" -> status = Donation.Status.failed;
                case "charge.refunded" -> status = Donation.Status.refunded;
                default -> {
                    return ResponseEntity.ok("Evento ignorado: " + event.getType());
                }
            }

            donation.setStatus(status);

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
