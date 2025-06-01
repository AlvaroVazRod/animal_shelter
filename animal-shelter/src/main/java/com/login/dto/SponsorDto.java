package com.login.dto;

import com.login.model.Sponsor;

public class SponsorDto {
    private Long id;
    private Double quantity;
    private Sponsor.Status status;
    private String stripeRef;
    private Long idUser;
    private Long idAnimal;

    // Nuevos campos útiles para frontend:
    private String animalName;
    private String animalImage;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Sponsor.Status getStatus() { return status; }
    public void setStatus(Sponsor.Status status) { this.status = status; }

    public String getStripeRef() { return stripeRef; }
    public void setStripeRef(String stripeRef) { this.stripeRef = stripeRef; }

    public Long getIdUser() { return idUser; }
    public void setIdUser(Long idUser) { this.idUser = idUser; }

    public Long getIdAnimal() { return idAnimal; }
    public void setIdAnimal(Long idAnimal) { this.idAnimal = idAnimal; }

    public String getAnimalName() { return animalName; }
    public void setAnimalName(String animalName) { this.animalName = animalName; }

    public String getAnimalImage() { return animalImage; }
    public void setAnimalImage(String animalImage) { this.animalImage = animalImage; }
}

