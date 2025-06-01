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
import com.login.service.StripeService;
import com.login.utils.AnimalPricingUtils;
import com.stripe.exception.StripeException;

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
    
    @Autowired
    private StripeService stripeService;

    public AnimalServiceImpl(AnimalRepository animalRepository, 
                             TagRepository tagRepository,
                             StripeService stripeService) {
        this.animalRepository = animalRepository;
        this.tagRepository = tagRepository;
        this.stripeService = stripeService;
    }

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
        try {
            Animal animal = AnimalMapper.toEntity(dto);
            setAnimalImages(animal, dto.getImages());

            if (dto.getTags() != null && !dto.getTags().isEmpty()) {
                List<Long> tagIds = dto.getTags().stream()
                    .map(tagDto -> tagDto.getId())
                    .collect(Collectors.toList());
                animal.setTags(tagRepository.findByIdIn(tagIds));
            }

            double precio = AnimalPricingUtils.calcularPrecioApadrinamiento(animal);
            animal.setSponsorPrice(precio);

            String productId = stripeService.createProduct(animal.getName(), animal.getDescription());
            String priceId = stripeService.createRecurringPrice(productId, precio);

            animal.setStripeProductId(productId);
            animal.setStripePriceId(priceId);

            Animal saved = animalRepository.save(animal);
            return ResponseEntity.ok(AnimalMapper.toDto(saved));
        } catch (StripeException e) {
            throw new RuntimeException("Error al crear producto en Stripe: " + e.getMessage(), e);
        }
    }




    @Override
    public ResponseEntity<AnimalDto> updateDto(Long id, AnimalDto dto) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));

        try {
            if (dto.getName() != null && !dto.getName().equals(animal.getName()) ||
                dto.getDescription() != null && !dto.getDescription().equals(animal.getDescription())) {
                stripeService.updateProduct(animal.getStripeProductId(), dto.getName(), dto.getDescription());
            }

            if (dto.getSponsorPrice() != null && !dto.getSponsorPrice().equals(animal.getSponsorPrice())) {
                String newPriceId = stripeService.createRecurringPrice(animal.getStripeProductId(), dto.getSponsorPrice());
                animal.setStripePriceId(newPriceId);
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error al actualizar producto/precio en Stripe: " + e.getMessage(), e);
        }

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

        if (animal.getStripeProductId() != null) {
            try {
                stripeService.archiveProduct(animal.getStripeProductId());
            } catch (StripeException e) {
                throw new RuntimeException("Error al archivar producto en Stripe: " + e.getMessage(), e);
            }
        }

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
    
    @Override
    public ResponseEntity<Double> getSponsorPrice(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));
        return ResponseEntity.ok(animal.getSponsorPrice());
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
