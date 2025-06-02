package com.login.mapper;

import com.login.dto.AnimalImageDto;
import com.login.model.AnimalImage;

public class AnimalImageMapper {

    public static AnimalImageDto toDto(AnimalImage image) {
        AnimalImageDto dto = new AnimalImageDto();
        dto.setId(image.getId());
        dto.setFilename(image.getFilename());
        dto.setFechaSubida(image.getFechaSubida());
        dto.setAnimalId(image.getAnimal() != null ? image.getAnimal().getId() : null);
        return dto;
    }

    public static AnimalImage toEntity(AnimalImageDto dto) {
        AnimalImage entity = new AnimalImage();
        entity.setId(dto.getId());
        entity.setFilename(dto.getFilename());
        entity.setFechaSubida(dto.getFechaSubida());
        return entity;
    }
}
