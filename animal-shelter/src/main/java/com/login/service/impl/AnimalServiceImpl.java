package com.login.service.impl;

import com.login.dto.AnimalDto;	
import com.login.dto.AnimalImageDto;
import com.login.exception.ResourceNotFoundException;
import com.login.mapper.AnimalMapper;
import com.login.model.Animal;
import com.login.model.AnimalImage;
import com.login.repository.AnimalRepository;
import com.login.repository.TagRepository;
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

    @Autowired
    private TagRepository tagRepository;
    
    @Override
    public List<AnimalDto> getAllDto() {
        return animalRepository.findAll()
                .stream()
                .map(AnimalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<AnimalDto> getDtoById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));

        if (animal.getImages() != null) {
            animal.getImages().size();
        }

        return ResponseEntity.ok(AnimalMapper.toDto(animal));
    }

    @Override
    public ResponseEntity<AnimalDto> createDto(AnimalDto dto) {
        Animal animal = AnimalMapper.toEntity(dto);
        setAnimalImages(animal, dto.getImages());
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            List<Long> tagIds = dto.getTags().stream()
                .map(tagDto -> tagDto.getId())
                .collect(Collectors.toList());
            animal.setTags(tagRepository.findByIdIn(tagIds));
        }
        Animal saved = animalRepository.save(animal);
        return ResponseEntity.ok(AnimalMapper.toDto(saved));
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
        animal.setCollected(dto.getCollected());
        animal.setAdoptionPrice(dto.getAdoptionPrice());
        animal.setSponsorPrice(dto.getSponsorPrice());
        animal.setStatus(Animal.AnimalStatus.valueOf(dto.getStatus()));
        setAnimalImages(animal, dto.getImages());
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            List<Long> tagIds = dto.getTags().stream()
                .map(tagDto -> tagDto.getId())
                .collect(Collectors.toList());

            animal.setTags(tagRepository.findByIdIn(tagIds));
        }


        return ResponseEntity.ok(AnimalMapper.toDto(animalRepository.save(animal)));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        animalRepository.delete(animal);
        return ResponseEntity.noContent().build();
    }

    @Override
    public Page<AnimalDto> getFilteredAnimals(String species, String genderText, Pageable pageable) {
        Page<Animal> animals;

        if (species != null && genderText != null) {
            boolean gender = convertGender(genderText);
            animals = animalRepository.findBySpeciesAndGender(species, gender, pageable);
        } else if (species != null) {
            animals = animalRepository.findBySpecies(species, pageable);
        } else if (genderText != null) {
            boolean gender = convertGender(genderText);
            animals = animalRepository.findByGender(gender, pageable);
        } else {
            animals = animalRepository.findAll(pageable);
        }

        animals.forEach(animal -> animal.getImages().size());

        return animals.map(AnimalMapper::toDto);
    }

    @Override
    public ResponseEntity<AnimalDto> updateImage(Long id, String filename) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        animal.setImage(filename);
        return ResponseEntity.ok(AnimalMapper.toDto(animalRepository.save(animal)));
    }

    private boolean convertGender(String genderText) {
        if ("masculino".equalsIgnoreCase(genderText)) return true;
        if ("femenino".equalsIgnoreCase(genderText)) return false;
        throw new IllegalArgumentException("Género inválido: debe ser 'masculino' o 'femenino'");
    }

    private void setAnimalImages(Animal animal, List<AnimalImageDto> imageDtos) {
        if (imageDtos != null) {
            animal.getImages().clear();
            imageDtos.forEach(dto -> {
                AnimalImage image = new AnimalImage();
                image.setFilename(dto.getFilename());
                image.setFechaSubida(dto.getFechaSubida());
                image.setAnimal(animal);
                animal.getImages().add(image);
            });
        }
    }
}
