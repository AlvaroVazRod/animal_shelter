package com.login.controller;

import com.login.exception.ResourceNotFoundException;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.model.checkout.Session;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
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

        // Si no hay priceId de Stripe, crear producto y precio
        if (animal.getStripePriceId() == null || animal.getStripePriceId().isBlank()) {

            // 1. Crear el producto en Stripe
            ProductCreateParams productParams = ProductCreateParams.builder()
                    .setName("Apadrinar a " + animal.getName())
                    .build();
            Product product = Product.create(productParams);

            // 2. Crear el precio mensual
            PriceCreateParams priceParams = PriceCreateParams.builder()
                    .setUnitAmount((long) (animal.getSponsorPrice() * 100)) // en centavos
                    .setCurrency("eur")
                    .setRecurring(
                            PriceCreateParams.Recurring.builder()
                                    .setInterval(PriceCreateParams.Recurring.Interval.MONTH)
                                    .build()
                    )
                    .setProduct(product.getId())
                    .build();
            Price price = Price.create(priceParams);

            // 3. Guardar en la BBDD
            animal.setStripeProductId(product.getId());
            animal.setStripePriceId(price.getId());
            animalRepository.save(animal);
        }

        // Crear la sesión de Stripe
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
