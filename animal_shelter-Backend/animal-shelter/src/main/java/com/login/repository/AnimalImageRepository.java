package com.login.repository;

import com.login.model.AnimalImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnimalImageRepository extends JpaRepository<AnimalImage, Long> {
    List<AnimalImage> findByAnimalId(Long animalId);
}
