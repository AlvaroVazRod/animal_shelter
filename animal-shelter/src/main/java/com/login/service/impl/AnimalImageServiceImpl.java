package com.login.service.impl;

import com.login.dto.AnimalImageDto;
import com.login.exception.ResourceNotFoundException;
import com.login.mapper.AnimalImageMapper;
import com.login.model.Animal;
import com.login.model.AnimalImage;
import com.login.repository.AnimalImageRepository;
import com.login.repository.AnimalRepository;
import com.login.service.AnimalImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnimalImageServiceImpl implements AnimalImageService {

    private final AnimalImageRepository imageRepository;
    private final AnimalRepository animalRepository;

    @Value("${animal.image.upload-dir:uploads/animals}")
    private String uploadDir;

    private Path uploadPath;

    public AnimalImageServiceImpl(AnimalImageRepository imageRepository, AnimalRepository animalRepository) {
        this.imageRepository = imageRepository;
        this.animalRepository = animalRepository;
    }

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir);
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de imágenes de animales", e);
        }
    }

    @Override
    public List<AnimalImageDto> getImagesByAnimalId(Long animalId) {
        return imageRepository.findByAnimalId(animalId)
                .stream()
                .map(AnimalImageMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnimalImageDto uploadImage(MultipartFile file, Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado"));

        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }

        AnimalImage image = new AnimalImage();
        image.setFilename(fileName);
        image.setAnimal(animal);

        return AnimalImageMapper.toDto(imageRepository.save(image));
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf(".");
        return dotIndex != -1 ? filename.substring(dotIndex) : "";
    }
}
