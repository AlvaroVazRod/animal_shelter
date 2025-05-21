package com.login.mapper;

import com.login.dto.AnimalDto;
import com.login.model.Animal;

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
        dto.setColor(animal.getColor());
        dto.setImage(animal.getImage());
        dto.setSpecies(animal.getSpecies());
        dto.setBreed(animal.getBreed());
        dto.setMaxDonations(animal.getMaxDonations());
        dto.setCollected(animal.getCollected());
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
        animal.setColor(dto.getColor());
        animal.setImage(dto.getImage());
        animal.setSpecies(dto.getSpecies());
        animal.setBreed(dto.getBreed());
        animal.setMaxDonations(dto.getMaxDonations());
        animal.setCollected(dto.getCollected());
        return animal;
    }
}