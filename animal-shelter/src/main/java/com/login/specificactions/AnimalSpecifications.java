package com.login.specificactions;

import com.login.model.Animal;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class AnimalSpecifications {

    public static Specification<Animal> hasSpecies(String species) {
        return (root, query, cb) -> species == null ? null : cb.equal(root.get("species"), species);
    }

    public static Specification<Animal> hasGender(Boolean gender) {
        return (root, query, cb) -> gender == null ? null : cb.equal(root.get("gender"), gender);
    }

    public static Specification<Animal> hasSize(String size) {
        return (root, query, cb) -> size == null ? null : cb.equal(root.get("size"), size);
    }

    public static Specification<Animal> hasArrivalDateAfter(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.greaterThanOrEqualTo(root.get("arrivalDate"), date);
    }

    public static Specification<Animal> hasArrivalDateBefore(LocalDate date) {
        return (root, query, cb) -> date == null ? null : cb.lessThanOrEqualTo(root.get("arrivalDate"), date);
    }
}
