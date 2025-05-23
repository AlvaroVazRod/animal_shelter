package com.login.dto;

import java.util.List;
import jakarta.validation.constraints.*;

public class AnimalDto {

	private Long id;

	@NotBlank(message = "El nombre no puede estar vacío")
	private String name;

	private String description;

	@DecimalMin(value = "0.0", message = "El peso debe ser positivo")
	private Double weight;

	@DecimalMin(value = "0.0", message = "La altura debe ser positiva")
	private Double height;

	@DecimalMin(value = "0.0", message = "La longitud debe ser positiva")
	private Double length;

	@Min(value = 0, message = "La edad debe ser positiva")
	private Integer age;
	
	@NotNull(message = "El genero debe de identarse")
	private Boolean gender;

	private String color;

	private String image;

	private String species;

	private String breed;

	@NotNull(message = "La cantidad máxima de donaciones es obligatoria")
	@DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
	private Double maxDonations;

	@NotNull(message = "El precio de adopción es obligatorio")
	@DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
	private Double adoptionPrice;

	@NotNull(message = "El precio de apadrinamiento es obligatorio")
	@DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
	private Double sponsorPrice;

	@DecimalMin(value = "0.0", message = "Debe ser un valor positivo")
	private Double collected;

	private String status;

	private List<AnimalImageDto> images;


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
	public Boolean getGender() {
		return gender;
	}
	
	public void setGender(Boolean gender) {
		this.gender=gender;
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

	public Double getMaxDonations() {
		return maxDonations;
	}

	public void setMaxDonations(Double maxDonations) {
		this.maxDonations = maxDonations;
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
}
