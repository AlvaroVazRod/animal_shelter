package com.login.controller;

import com.login.dto.AnimalDto;	
import com.login.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/animales")
@CrossOrigin
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<Page<AnimalDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String gender) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(animalService.getFilteredAnimals(gender, species, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDto> getById(@PathVariable Long id) {
        return animalService.getDtoById(id);
    }

    @PostMapping
    public ResponseEntity<AnimalDto> create(@Valid @RequestBody AnimalDto animalDto) {
        return animalService.createDto(animalDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalDto> update(@PathVariable Long id,
                                            @Valid @RequestBody AnimalDto animalDto) {
        return animalService.updateDto(id, animalDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return animalService.delete(id);
    }
    
    @PutMapping("/{id}/image")
    public ResponseEntity<AnimalDto> updateAnimalImage(
            @PathVariable Long id,
            @RequestParam String filename) {
        return animalService.updateImage(id, filename);
    }

}
