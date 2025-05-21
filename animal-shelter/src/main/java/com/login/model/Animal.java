package com.login.model;

import jakarta.persistence.*;
import lombok.Data;

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
    private boolean gender;
    private String color;
    private String image;
    private String species;
    private String breed;
    private Double maxDonations;
    private Double collected;
}
