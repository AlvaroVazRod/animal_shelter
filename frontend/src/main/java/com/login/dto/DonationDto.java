package com.login.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Schema(description = "Data transfer object representing a donation made by a user")
public class DonationDto {

    @Schema(description = "Unique identifier of the donation", example = "101")
    private Long id;

    @Schema(description = "Amount of the donation in euros", example = "25.00")
    private Double quantity;

    @Schema(description = "Date and time when the donation was made", example = "2024-06-01T12:30:00")
    private LocalDateTime date;

    @Schema(description = "Status of the donation", example = "completed")
    private String status;

    @Schema(description = "Payment method used for the donation", example = "stripe")
    private String paymentMethod;

    @Schema(description = "Stripe PaymentIntent ID associated with the donation", example = "pi_1NKhxZGd3")
    private String stripePaymentIntentId;

    @Schema(description = "ID of the user who made the donation", example = "3")
    private Long userId;

    @Schema(description = "Name of the user who made the donation", example = "Jane Doe")
    private String userName;

    @Schema(description = "ID of the animal related to the donation", example = "7")
    private Long animalId;

    @Schema(description = "Name of the animal related to the donation", example = "Luna")
    private String animalName;
}
