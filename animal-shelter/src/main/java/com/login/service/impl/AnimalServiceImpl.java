package com.login.service.impl;

import com.login.model.Animal;
import com.login.repository.AnimalRepository;
import com.login.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalServiceImpl implements AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Override
    public List<Animal> getAll() {
        return animalRepository.findAll();
    }

    @Override
    public ResponseEntity<Animal> getById(Long id) {
        Optional<Animal> animal = animalRepository.findById(id);
        return animal.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public Animal save(Animal animal) {
        return animalRepository.save(animal);
    }

    @Override
    public Animal update(Long id, Animal animalDetails) {
        Animal animal = animalRepository.findById(id).orElseThrow();
        animal.setName(animalDetails.getName());
        animal.setDescription(animalDetails.getDescription());
        animal.setWeight(animalDetails.getWeight());
        animal.setHeight(animalDetails.getHeight());
        animal.setLength(animalDetails.getLength());
        animal.setAge(animalDetails.getAge());
        animal.setColor(animalDetails.getColor());
        animal.setImage(animalDetails.getImage());
        animal.setSpecies(animalDetails.getSpecies());
        animal.setBreed(animalDetails.getBreed());
        animal.setMaxDonations(animalDetails.getMaxDonations());
        animal.setCollected(animalDetails.getCollected());
        return animalRepository.save(animal);
    }

    @Override
    public void delete(Long id) {
        animalRepository.deleteById(id);
    }
}
