package com.login.service.impl;

import com.login.dto.AnimalDto;	
import com.login.exception.ResourceNotFoundException;
import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.login.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalServiceImpl implements AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    private AnimalDto mapToDto(Animal animal) {
        AnimalDto dto = new AnimalDto();
        dto.setId(animal.getId());
        dto.setName(animal.getName());
        dto.setDescription(animal.getDescription());
        dto.setWeight(animal.getWeight());
        dto.setHeight(animal.getHeight());
        dto.setLength(animal.getLength());
        dto.setAge(animal.getAge());
        dto.setColor(animal.getColor());
        dto.setImage(animal.getImage());
        dto.setSpecies(animal.getSpecies());
        dto.setBreed(animal.getBreed());
        dto.setMaxDonations(animal.getMaxDonations());
        dto.setCollected(animal.getCollected());
        return dto;
    }

    private Animal mapToEntity(AnimalDto dto) {
        Animal animal = new Animal();
        animal.setName(dto.getName());
        animal.setDescription(dto.getDescription());
        animal.setWeight(dto.getWeight());
        animal.setHeight(dto.getHeight());
        animal.setLength(dto.getLength());
        animal.setAge(dto.getAge());
        animal.setColor(dto.getColor());
        animal.setImage(dto.getImage());
        animal.setSpecies(dto.getSpecies());
        animal.setBreed(dto.getBreed());
        animal.setMaxDonations(dto.getMaxDonations());
        animal.setCollected(dto.getCollected());
        return animal;
    }

    @Override
    public List<AnimalDto> getAllDto() {
        return animalRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<AnimalDto> getDtoById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        return ResponseEntity.ok(mapToDto(animal));
    }

    @Override
    public ResponseEntity<AnimalDto> createDto(AnimalDto dto) {
        Animal saved = animalRepository.save(mapToEntity(dto));
        return ResponseEntity.ok(mapToDto(saved));
    }

    @Override
    public ResponseEntity<AnimalDto> updateDto(Long id, AnimalDto dto) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));

        animal.setName(dto.getName());
        animal.setDescription(dto.getDescription());
        animal.setWeight(dto.getWeight());
        animal.setHeight(dto.getHeight());
        animal.setLength(dto.getLength());
        animal.setAge(dto.getAge());
        animal.setColor(dto.getColor());
        animal.setImage(dto.getImage());
        animal.setSpecies(dto.getSpecies());
        animal.setBreed(dto.getBreed());
        animal.setMaxDonations(dto.getMaxDonations());
        animal.setCollected(dto.getCollected());

        return ResponseEntity.ok(mapToDto(animalRepository.save(animal)));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        animalRepository.delete(animal);
        return ResponseEntity.noContent().build();
    }
    @Override
    public Page<AnimalDto> getFilteredAnimals(String breed, String genderText, Pageable pageable) {
        Page<Animal> animals;

        // Si hay filtro de raza y sexo
        if (breed != null && genderText != null) {
            boolean gender = convertGender(genderText);
            animals = animalRepository.findByBreedAndGender(breed, gender, pageable);
        }
        // Solo filtro por raza
        else if (breed != null) {
            animals = animalRepository.findByBreed(breed, pageable);
        }
        // Solo filtro por sexo
        else if (genderText != null) {
            boolean gender = convertGender(genderText);
            animals = animalRepository.findByGender(gender, pageable);
        }
        // Sin filtros
        else {
            animals = animalRepository.findAll(pageable);
        }

        return animals.map(this::mapToDto);
    }

    private boolean convertGender(String genderText) {
        if ("masculino".equalsIgnoreCase(genderText)) return true;
        if ("femenino".equalsIgnoreCase(genderText)) return false;
        throw new IllegalArgumentException("Género inválido: debe ser 'masculino' o 'femenino'");
    }
}