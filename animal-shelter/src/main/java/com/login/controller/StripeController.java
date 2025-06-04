package com.login.controller;

import com.login.exception.ResourceNotFoundException;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.login.service.ProductAndPrice;
import com.login.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Stripe", description = "Endpoints for Stripe subscription payments")
@RestController
@RequestMapping("/api/stripe")
@CrossOrigin
public class StripeController {

    private final AnimalRepository animalRepository;
    private final StripeService stripeService;

    public StripeController(AnimalRepository animalRepository, StripeService stripeService) {
        this.animalRepository = animalRepository;
        this.stripeService = stripeService;
    }

    @Operation(summary = "Get sponsor price", description = "Returns the monthly sponsorship price for a given animal")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Price retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Animal not found")
    })
    @GetMapping("/sponsor-price/{animalId}")
    public ResponseEntity<Double> getSponsorPrice(@PathVariable Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found"));
        return ResponseEntity.ok(animal.getSponsorPrice());
    }

    @Operation(summary = "Create Stripe Checkout session for sponsorship",
               description = "Creates a Stripe Checkout session for a monthly sponsorship subscription for a specific animal")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Checkout session created"),
        @ApiResponse(responseCode = "404", description = "Animal not found")
    })
    @PostMapping("/sponsor-checkout/{animalId}")
    public ResponseEntity<Map<String, String>> createSponsorCheckoutSession(
            @PathVariable Long animalId,
            @RequestHeader("Authorization") String authHeader) throws StripeException {

        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found"));

        ProductAndPrice result = stripeService.ensureActiveProductAndPrice(
                animal.getStripeProductId(),
                animal.getStripePriceId(),
                "Apadrinar a " + animal.getName(),
                animal.getDescription(),
                animal.getSponsorPrice()
        );

        animal.setStripeProductId(result.getProductId());
        animal.setStripePriceId(result.getPriceId());
        animalRepository.save(animal);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl("http://localhost:5173/success?sponsor=true")
                .setCancelUrl("http://localhost:5173/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(animal.getStripePriceId())
                                .setQuantity(1L)
                                .build())
                .build();

        Session session = Session.create(params);
        return ResponseEntity.ok(Map.of("sessionId", session.getId()));
    }
}
