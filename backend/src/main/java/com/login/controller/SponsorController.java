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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Tag(name = "Sponsorships", description = "Endpoints related to animal sponsorships")
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

    @Operation(summary = "Get sponsorship price", description = "Calculates the monthly sponsorship price for a specific animal by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Price calculated successfully"),
        @ApiResponse(responseCode = "404", description = "Animal not found")
    })
    @GetMapping("/price/{id}")
    public ResponseEntity<Double> getPrecioApadrinamiento(@PathVariable Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        double precio = AnimalPricingUtils.calcularPrecioApadrinamiento(animal);
        return ResponseEntity.ok(precio);
    }

    @Operation(summary = "Get my sponsorships", description = "Retrieves the list of active sponsorships for the authenticated user")
    @ApiResponse(responseCode = "200", description = "Sponsorships retrieved successfully")
    @GetMapping("/my-sponsors")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<SponsorDto>> getMySponsorships(Authentication authentication) {
        String username = authentication.getName();
        List<SponsorDto> sponsors = sponsorService.getSponsorsByUsername(username);
        return ResponseEntity.ok(sponsors);
    }

    @Operation(summary = "Cancel sponsorship", description = "Cancels a sponsorship for the authenticated user")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Sponsorship cancelled successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/cancel/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> cancelSponsorship(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        sponsorService.cancelSponsor(id, username);
        return ResponseEntity.noContent().build();
    }
}
