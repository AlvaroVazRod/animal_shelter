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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Tag(name = "Stripe Webhook", description = "Handles Stripe webhook events for donations and sponsorships")
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

    public StripeWebhookController(
            DonationRepository donationRepository,
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

    @Operation(summary = "Handle Stripe webhook", description = "Receives and processes webhook events from Stripe, including donations and sponsorships")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Event processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid signature or JSON format")
    })
    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }
        webhookLogRepository.save(WebhookLog.builder()
                .eventType(event.getType())
                .receivedAt(LocalDateTime.now())
                .rawPayload(payload)
                .build());

        try {
            JsonNode object = objectMapper.readTree(payload).at("/data/object");

            switch (event.getType()) {
                case "checkout.session.completed" -> handleCheckoutCompleted(object);
                case "invoice.paid", "invoice.payment_failed", "invoice.canceled" -> handleInvoice(object);
                case "payment_intent.succeeded", "payment_intent.canceled", "payment_intent.payment_failed", "charge.refunded" -> handleDonation(event.getType(), object);
                default -> {
                    return ResponseEntity.ok("Evento ignorado: " + event.getType());
                }
            }

            return ResponseEntity.ok("Evento procesado: " + event.getType());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error procesando JSON");
        }
    }

    private void handleCheckoutCompleted(JsonNode object) {
        if (!object.has("mode")) return;

        String mode = object.get("mode").asText();
        if ("subscription".equals(mode)) {
            String sessionId = object.get("id").asText();
            String email = object.path("customer_email").asText(null);
            String clientReferenceId = object.path("client_reference_id").asText(null);

            if (email != null && clientReferenceId != null) {
                Long animalId = Long.parseLong(clientReferenceId);
                Optional<User> userOpt = userRepository.findByEmail(email);
                Optional<Animal> animalOpt = animalRepository.findById(animalId);

                if (userOpt.isPresent() && animalOpt.isPresent() && !sponsorRepository.existsByStripeRef(sessionId)) {
                    Sponsor sponsor = new Sponsor();
                    sponsor.setStripeRef(sessionId);
                    sponsor.setStatus(Sponsor.Status.completed);
                    sponsor.setQuantity(animalOpt.get().getSponsorPrice());
                    sponsor.setIdUser(userOpt.get());
                    sponsor.setIdAnimal(animalOpt.get());
                    sponsorRepository.save(sponsor);
                }
            }
        }
    }

    private void handleInvoice(JsonNode object) {
        String subscriptionId = object.path("subscription").asText(null);
        String statusStr = object.path("status").asText(null);
        double amount = object.path("amount_paid").asDouble(0.0) / 100;

        if (subscriptionId == null || statusStr == null) return;

        Sponsor.Status status = switch (statusStr) {
            case "paid" -> Sponsor.Status.completed;
            case "unpaid", "incomplete", "past_due" -> Sponsor.Status.failed;
            case "canceled" -> Sponsor.Status.cancelled;
            default -> Sponsor.Status.failed;
        };

        sponsorRepository.findByStripeRef(subscriptionId).ifPresent(sponsor -> {
            sponsor.setStatus(status);
            sponsor.setQuantity(amount);
            sponsorRepository.save(sponsor);

            if (status == Sponsor.Status.cancelled || status == Sponsor.Status.failed) {
                User user = sponsor.getIdUser();
                if (user != null && user.getEmail() != null) {
                    String subject = "Your sponsorship has been " + (status == Sponsor.Status.cancelled ? "cancelled" : "failed");
                    String body = "Hello " + user.getName() + ",\n\n" +
                            "Your subscription was marked as " + status.name() + ". " +
                            "Please check your payment method or contact us if this was a mistake.\n\nThank you for your support.";
                    emailService.sendSimpleMessage(user.getEmail(), subject, body);
                }
            }
        });
    }

    private void handleDonation(String eventType, JsonNode object) {
        String intentId = object.path("id").asText(null);
        if (intentId == null || donationRepository.findByStripePaymentIntentId(intentId).isPresent()) return;

        Donation donation = new Donation();
        donation.setStripePaymentIntentId(intentId);
        donation.setDate(LocalDateTime.now());
        donation.setPaymentMethod("stripe");
        donation.setQuantity(object.path("amount").asDouble(0.0) / 100);

        Donation.Status status = switch (eventType) {
            case "payment_intent.succeeded" -> Donation.Status.completed;
            case "payment_intent.canceled" -> Donation.Status.cancelled;
            case "payment_intent.payment_failed" -> Donation.Status.failed;
            case "charge.refunded" -> Donation.Status.refunded;
            default -> Donation.Status.failed;
        };
        donation.setStatus(status);

        JsonNode metadata = object.path("metadata");
        if (metadata != null && metadata.isObject()) {
            Optional.ofNullable(metadata.path("id_user").asLong())
                    .flatMap(userRepository::findById)
                    .ifPresent(donation::setUser);
            Optional.ofNullable(metadata.path("id_animal").asLong())
                    .flatMap(animalRepository::findById)
                    .ifPresent(donation::setAnimal);
        }

        donationRepository.save(donation);
    }
}
