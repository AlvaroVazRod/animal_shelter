package com.login.controller;

import com.login.dto.SponsorDto;
import com.login.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.login.service.SponsorService;
import com.login.utils.AnimalPricingUtils;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sponsor")
@CrossOrigin
public class SponsorController {

    private final AnimalRepository animalRepository;
    private final SponsorService sponsorService;

    public SponsorController(AnimalRepository animalRepository, SponsorService sponsorService) {
        this.animalRepository = animalRepository;
        this.sponsorService = sponsorService;
    }

    @GetMapping("/price/{id}")
    public ResponseEntity<Double> getPrecioApadrinamiento(@PathVariable Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        double precio = AnimalPricingUtils.calcularPrecioApadrinamiento(animal);
        return ResponseEntity.ok(precio);
    }
    
    @GetMapping("/my-sponsors")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<SponsorDto>> getMySponsorships(Authentication authentication) {
        String username = authentication.getName();
        List<SponsorDto> sponsors = sponsorService.getSponsorsByUsername(username);
        return ResponseEntity.ok(sponsors);
    }

    @DeleteMapping("/cancel/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> cancelSponsorship(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        sponsorService.cancelSponsor(id, username);
        return ResponseEntity.noContent().build();
    }
}
