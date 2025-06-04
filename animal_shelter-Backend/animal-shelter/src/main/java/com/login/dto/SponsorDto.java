package com.login.dto;

import com.login.model.Sponsor;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Data transfer object representing a sponsorship record")
public class SponsorDto {

    @Schema(description = "Unique identifier of the sponsorship", example = "3001")
    private Long id;

    @Schema(description = "Monthly amount sponsored in euros", example = "20.0")
    private Double quantity;

    @Schema(description = "Current status of the sponsorship", example = "completed")
    private Sponsor.Status status;

    @Schema(description = "Stripe subscription or session reference", example = "sub_1NRxYJG2")
    private String stripeRef;

    @Schema(description = "ID of the user who is sponsoring", example = "5")
    private Long idUser;

    @Schema(description = "ID of the sponsored animal", example = "9")
    private Long idAnimal;

    @Schema(description = "Name of the sponsored animal", example = "Luna")
    private String animalName;

    @Schema(description = "Main image filename of the animal", example = "luna.jpg")
    private String animalImage;

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
