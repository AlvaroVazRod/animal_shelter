package com.login.controller;

import com.login.dto.AnimalDto;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.login.service.AnimalService;
import com.login.utils.AnimalPricingUtils;
import com.stripe.exception.StripeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Animals", description = "Operations related to animal data")
@RestController
@RequestMapping("/api/animales")
@CrossOrigin
public class AnimalController {

    private final AnimalService animalService;
    private final AnimalRepository animalRepository;

    public AnimalController(AnimalRepository animalRepository, AnimalService animalService) {
        this.animalRepository = animalRepository;
        this.animalService = animalService;
    }

    @Operation(summary = "Get paginated list of animals", description = "Returns a paginated and optionally filtered list of animals")
    @ApiResponse(responseCode = "200", description = "Animals retrieved successfully")
    @GetMapping
    public ResponseEntity<Page<AnimalDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(name="sortby", defaultValue = "gender") String sortBy,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String species) {

        if (!sortBy.equals("gender") && !sortBy.equals("species")) {
            return ResponseEntity.badRequest().body(Page.empty());
        }

        PageRequest pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(animalService.getFilteredAnimals(species, gender, pageable));
    }

    @Operation(summary = "Get animal by ID", description = "Returns animal data by ID, including sponsor price calculation if needed")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Animal retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Animal not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AnimalDto> getById(@PathVariable Long id) {
        Animal animal = animalRepository.findById(id).orElseThrow();
        if (animal.getSponsorPrice() == null) {
            double precio = AnimalPricingUtils.calcularPrecioApadrinamiento(animal);
            animal.setSponsorPrice(precio);
            animalRepository.save(animal);
        }
        return animalService.getDtoById(id);
    }

    @Operation(summary = "Create animal", description = "Creates a new animal")
    @ApiResponse(responseCode = "200", description = "Animal created successfully")
    @PostMapping
    public ResponseEntity<AnimalDto> create(@Valid @RequestBody AnimalDto animalDto) throws StripeException {
        return animalService.createDto(animalDto);
    }

    @Operation(summary = "Update animal", description = "Updates an existing animal")
    @ApiResponse(responseCode = "200", description = "Animal updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<AnimalDto> update(@PathVariable Long id,
                                            @Valid @RequestBody AnimalDto animalDto) {
        return animalService.updateDto(id, animalDto);
    }

    @Operation(summary = "Delete animal", description = "Deletes an animal by ID")
    @ApiResponse(responseCode = "204", description = "Animal deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return animalService.delete(id);
    }

    @Operation(summary = "Update animal image", description = "Updates the main image of an animal")
    @ApiResponse(responseCode = "200", description = "Animal image updated")
    @PutMapping("/{id}/image")
    public ResponseEntity<AnimalDto> updateAnimalImage(
            @PathVariable Long id,
            @RequestParam String filename) {
        return animalService.updateImage(id, filename);
    }

    @Operation(summary = "Get sponsor price", description = "Returns the sponsor price for an animal, calculating and saving it if missing")
    @ApiResponse(responseCode = "200", description = "Sponsor price retrieved")
    @GetMapping("/{id}/sponsor-price")
    public ResponseEntity<Double> getSponsorPrice(@PathVariable Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found"));
        if (animal.getSponsorPrice() == null) {
            double precio = AnimalPricingUtils.calcularPrecioApadrinamiento(animal);
            animal.setSponsorPrice(precio);
            animalRepository.save(animal);
        }

        return ResponseEntity.ok(animal.getSponsorPrice());
    }
}
