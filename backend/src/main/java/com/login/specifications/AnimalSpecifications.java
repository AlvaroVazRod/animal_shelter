package com.login.specifications;

import com.login.model.Animal;
import com.login.model.Tag;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;

public class AnimalSpecifications {

    public static Specification<Animal> hasSpecies(String species) {
        return (root, query, builder) -> builder.equal(root.get("species"), species);
    }

    public static Specification<Animal> hasGender(Boolean gender) {
        return (root, query, builder) -> builder.equal(root.get("gender"), gender);
    }

    public static Specification<Animal> hasSize(String size) {
        return (root, query, builder) -> {
            switch (size.toLowerCase()) {
                case "pequeño":
                    return builder.lessThan(root.get("weight"), 10.0);
                case "mediano":
                    return builder.between(root.get("weight"), 10.0, 25.0);
                case "grande":
                    return builder.greaterThan(root.get("weight"), 25.0);
                default:
                    return builder.conjunction();
            }
        };
    }

    public static Specification<Animal> hasTag(Long tagId) {
        return (root, query, builder) -> {
            query.distinct(true); 
            Join<Animal, Tag> tags = root.join("tags", JoinType.INNER);
            return builder.equal(tags.get("id"), tagId);
        };
    }

    public static Specification<Animal> orderByArrivalDateAsc() {
        return (Root<Animal> root, CriteriaQuery<?> query, CriteriaBuilder builder) -> {
            query.orderBy(builder.asc(root.get("arrivalDate")));
            return null;
        };
    }
}
