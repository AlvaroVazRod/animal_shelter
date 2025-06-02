package com.login.controller;

import com.login.dto.AnimalImageDto;
import com.login.service.AnimalImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Animal Images", description = "Endpoints for uploading and retrieving animal images")
@RestController
@RequestMapping("/api/animales/images")
@CrossOrigin
public class AnimalImageController {

    private final AnimalImageService animalImageService;

    public AnimalImageController(AnimalImageService animalImageService) {
        this.animalImageService = animalImageService;
    }

    @Operation(summary = "Get images by animal ID", description = "Retrieves all images associated with a specific animal")
    @ApiResponse(responseCode = "200", description = "Images retrieved successfully")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{animalId}")
    public ResponseEntity<List<AnimalImageDto>> getImagesByAnimal(@PathVariable Long animalId) {
        return ResponseEntity.ok(animalImageService.getImagesByAnimalId(animalId));
    }
    
    @Operation(summary = "Delete image by ID", description = "Deletes a specific image by its ID (admin only)")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Image deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Only admins can delete images"),
        @ApiResponse(responseCode = "404", description = "Image not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteAnimalImage(@PathVariable Long imageId) {
        return animalImageService.deleteAnimalImage(imageId);
    }

    @Operation(summary = "Upload image for animal", description = "Uploads an image for a specific animal (admin only)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Image uploaded successfully"),
        @ApiResponse(responseCode = "403", description = "Only admins can upload animal images")
    })
    @PostMapping("/upload/{animalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnimalImageDto> uploadAnimalImage(
            @PathVariable Long animalId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(animalImageService.uploadImage(file, animalId));
    }
}
