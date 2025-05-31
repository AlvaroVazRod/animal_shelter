package com.login.controller;

import com.login.exception.ResourceNotFoundException;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.login.utils.AnimalPricingUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sponsor")
@CrossOrigin
public class SponsorController {

    private final AnimalRepository animalRepository;

    public SponsorController(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    @GetMapping("/price/{id}")
    public ResponseEntity<Double> getPrecioApadrinamiento(@PathVariable Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        double precio = AnimalPricingUtils.calcularPrecioApadrinamiento(animal);
        return ResponseEntity.ok(precio);
    }
}
