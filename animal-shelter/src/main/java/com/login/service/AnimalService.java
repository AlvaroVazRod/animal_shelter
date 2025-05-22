package com.login.service;

import com.login.dto.AnimalDto;	
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface AnimalService {

    List<AnimalDto> getAllDto();

    ResponseEntity<AnimalDto> getDtoById(Long id);

    ResponseEntity<AnimalDto> createDto(AnimalDto animalDto);

    ResponseEntity<AnimalDto> updateDto(Long id, AnimalDto animalDto);

    ResponseEntity<Void> delete(Long id);
    
    Page<AnimalDto> getFilteredAnimals(String species, String genderText, Pageable pageable);

    ResponseEntity<AnimalDto> updateImage(Long id, String filename);
}


