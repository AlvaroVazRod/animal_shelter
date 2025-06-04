package com.login.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "animals")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double weight;
    private Double height;
    private Double length;
    private Integer age;
    private Boolean gender;
    private String color;
    private String image;
    private String species;
    private String breed;
    private Double collected;
    private Double adoptionPrice;
    private Double sponsorPrice;
    private LocalDateTime arrivalDate;
    private String stripeProductId;
    private String stripePriceId;

    @Enumerated(EnumType.STRING)
    private AnimalStatus status;

    @PrePersist
    public void prePersist() {
        if (arrivalDate == null) {
            arrivalDate = LocalDateTime.now();
        }
    }

    public enum AnimalStatus {
        draft, active, adopted, requires_funding
    }

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnimalImage> images = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "animals_tags",
        joinColumns = @JoinColumn(name = "id_animal"),
        inverseJoinColumns = @JoinColumn(name = "id_tag")
    )
    private List<Tag> tags = new ArrayList<>();

}
