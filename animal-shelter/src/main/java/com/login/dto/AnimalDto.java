package com.login.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "Data transfer object representing an animal")
public class AnimalDto {

    @Schema(description = "Unique identifier of the animal", example = "12")
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Schema(description = "Name of the animal", example = "Luna")
    private String name;

    @Schema(description = "Brief description or biography of the animal", example = "Friendly dog looking for a home")
    private String description;

    @DecimalMin(value = "0.0", message = "El peso debe ser positivo")
    @Schema(description = "Weight in kilograms", example = "10.5")
    private Double weight;

    @DecimalMin(value = "0.0", message = "La altura debe ser positiva")
    @Schema(description = "Height in centimeters", example = "40.0")
    private Double height;

    @DecimalMin(value = "0.0", message = "La longitud debe ser positiva")
    @Schema(description = "Length in centimeters", example = "60.0")
    private Double length;

    @Min(value = 0, message = "La edad debe ser positiva")
    @Schema(description = "Age in years", example = "3")
    private Integer age;

    @Pattern(regexp = "^(masculino|femenino)?$", message = "El género debe ser 'masculino', 'femenino' o estar vacío")
    @Schema(description = "Gender of the animal", example = "femenino")
    private String gender;

    @Schema(description = "Color of the animal", example = "Brown and white")
    private String color;

    @Schema(description = "Filename or URL of the main image", example = "luna.jpg")
    private String image;

    @Schema(description = "Species of the animal (e.g., dog, cat)", example = "dog")
    private String species;

    @Schema(description = "Breed of the animal", example = "Labrador")
    private String breed;

    @NotNull(message = "El precio de adopción es obligatorio")
    @DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
    @Schema(description = "Adoption price in euros", example = "50.0")
    private Double adoptionPrice;

    @NotNull(message = "El precio de apadrinamiento es obligatorio")
    @DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
    @Schema(description = "Monthly sponsor price in euros", example = "20.0")
    private Double sponsorPrice;

    @DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
    @Schema(description = "Amount collected so far in donations", example = "75.0")
    private Double collected;

    @Schema(description = "Current adoption status", example = "available")
    private String status;

    @Schema(description = "List of associated images", implementation = AnimalImageDto.class)
    private List<AnimalImageDto> images;

    @Schema(description = "List of associated tags", implementation = TagDto.class)
    private List<TagDto> tags;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public Double getHeight() {
		return height;
	}

	public void setHeight(Double height) {
		this.height = height;
	}

	public Double getLength() {
		return length;
	}

	public void setLength(Double length) {
		this.length = length;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}
	public String getGender() {
	    return gender;
	}

	public void setGender(String gender) {
	    this.gender = gender;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getSpecies() {
		return species;
	}

	public void setSpecies(String species) {
		this.species = species;
	}

	public String getBreed() {
		return breed;
	}

	public void setBreed(String breed) {
		this.breed = breed;
	}

	public Double getAdoptionPrice() {
		return adoptionPrice;
	}

	public void setAdoptionPrice(Double adoptionPrice) {
		this.adoptionPrice = adoptionPrice;
	}

	public Double getSponsorPrice() {
		return sponsorPrice;
	}

	public void setSponsorPrice(Double sponsorPrice) {
		this.sponsorPrice = sponsorPrice;
	}

	public Double getCollected() {
		return collected;
	}

	public void setCollected(Double collected) {
		this.collected = collected;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<AnimalImageDto> getImages() {
		return images;
	}

	public void setImages(List<AnimalImageDto> images) {
		this.images = images;
	}
	public List<TagDto> getTags() {
	    return tags;
	}

	public void setTags(List<TagDto> tags) {
	    this.tags = tags;
	}
}
