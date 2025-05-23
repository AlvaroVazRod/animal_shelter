package com.login.service;

import com.login.dto.AnimalImageDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AnimalImageService {
    List<AnimalImageDto> getImagesByAnimalId(Long animalId);
    AnimalImageDto uploadImage(MultipartFile file, Long animalId);
}
