package com.login.repository;

import com.login.model.Animal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
	Page<Animal> findByBreed(String breed, Pageable pageable);
	Page<Animal> findByGender(boolean gender, Pageable pageable);
	Page<Animal> findByBreedAndGender(String breed, boolean gender, Pageable pageable);


}
