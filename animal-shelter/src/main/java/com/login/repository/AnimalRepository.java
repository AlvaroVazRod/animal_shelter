package com.login.repository;

import com.login.model.Animal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    @EntityGraph(attributePaths = "images")
    Page<Animal> findBySpeciesAndGender(String species, boolean gender, Pageable pageable);

    @EntityGraph(attributePaths = "images")
    Page<Animal> findBySpecies(String species, Pageable pageable);

    @EntityGraph(attributePaths = "images")
    Page<Animal> findByGender(boolean gender, Pageable pageable);

    @EntityGraph(attributePaths = "images")
    Page<Animal> findAll(Pageable pageable);
}
