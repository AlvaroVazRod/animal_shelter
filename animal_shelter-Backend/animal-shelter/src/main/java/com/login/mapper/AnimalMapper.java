package com.login.mapper;

import com.login.dto.AnimalDto;
import com.login.dto.AnimalImageDto;
import com.login.model.Animal;

import java.util.List;
import java.util.stream.Collectors;

public class AnimalMapper {

    public static AnimalDto toDto(Animal animal) {
        AnimalDto dto = new AnimalDto();
        dto.setId(animal.getId());
        dto.setName(animal.getName());
        dto.setDescription(animal.getDescription());
        dto.setWeight(animal.getWeight());
        dto.setHeight(animal.getHeight());
        dto.setLength(animal.getLength());
        dto.setAge(animal.getAge());
        dto.setGender(animal.getGender() != null ? (animal.getGender() ? "masculino" : "femenino") : "");
        dto.setColor(animal.getColor());
        dto.setImage(animal.getImage());
        dto.setSpecies(animal.getSpecies());
        dto.setBreed(animal.getBreed());
        dto.setCollected(animal.getCollected());
        dto.setAdoptionPrice(animal.getAdoptionPrice());
        dto.setSponsorPrice(animal.getSponsorPrice());
        dto.setArrivalDate(animal.getArrivalDate());
        if (animal.getStatus() != null) {
            dto.setStatus(animal.getStatus().name());
        }

        if (animal.getImages() != null) {
            List<AnimalImageDto> imageDtos = animal.getImages()
                .stream()
                .map(image -> {
                    AnimalImageDto imageDto = new AnimalImageDto();
                    imageDto.setId(image.getId());
                    imageDto.setFilename(image.getFilename());
                    imageDto.setFechaSubida(image.getFechaSubida());
                    imageDto.setAnimalId(animal.getId());
                    return imageDto;
                })
                .collect(Collectors.toList());
            dto.setImages(imageDtos);
        }

        if (animal.getTags() != null) {
            dto.setTags(animal.getTags().stream()
                .map(TagMapper::toDto)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    public static Animal toEntity(AnimalDto dto) {
        Animal animal = new Animal();
        animal.setId(dto.getId());
        animal.setName(dto.getName());
        animal.setDescription(dto.getDescription());
        animal.setWeight(dto.getWeight());
        animal.setHeight(dto.getHeight());
        animal.setLength(dto.getLength());
        animal.setAge(dto.getAge());
        animal.setGender(dto.getGender() != null ? "masculino".equals(dto.getGender()) : null);
        animal.setColor(dto.getColor());
        animal.setImage(dto.getImage());
        animal.setSpecies(dto.getSpecies());
        animal.setBreed(dto.getBreed());
        animal.setCollected(dto.getCollected());
        animal.setAdoptionPrice(dto.getAdoptionPrice());
        animal.setSponsorPrice(dto.getSponsorPrice());
        animal.setArrivalDate(dto.getArrivalDate());
        if (dto.getImages() != null) {
            animal.setImages(dto.getImages().stream()
                .map(AnimalImageMapper::toEntity)
                .peek(img -> img.setAnimal(animal))
                .collect(Collectors.toList()));
        }
        if (dto.getStatus() != null) {
            animal.setStatus(Animal.AnimalStatus.valueOf(dto.getStatus()));
        }

        if (dto.getTags() != null) {
            animal.setTags(dto.getTags().stream()
                .map(TagMapper::toEntity)
                .collect(Collectors.toList()));
        }

        return animal;
    }
}
