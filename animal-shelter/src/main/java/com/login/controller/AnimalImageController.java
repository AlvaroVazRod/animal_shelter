package com.login.controller;

import com.login.dto.AnimalImageDto;
import com.login.service.AnimalImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/animales/images")
@CrossOrigin
public class AnimalImageController {


    private final AnimalImageService animalImageService;

    public AnimalImageController(AnimalImageService animalImageService) {
        this.animalImageService = animalImageService;
    }


    @GetMapping("/{animalId}")
    public ResponseEntity<List<AnimalImageDto>> getImagesByAnimal(@PathVariable Long animalId) {
        return ResponseEntity.ok(animalImageService.getImagesByAnimalId(animalId));
    }

    @PostMapping("/upload/{animalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnimalImageDto> uploadAnimalImage(
            @PathVariable Long animalId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(animalImageService.uploadImage(file, animalId));
    }
}
