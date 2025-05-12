package com.login.service;

import com.login.model.Animal;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface AnimalService {
    List<Animal> getAll();
    ResponseEntity<Animal> getById(Long id);
    Animal save(Animal animal);
    Animal update(Long id, Animal animal);
    void delete(Long id);
}
