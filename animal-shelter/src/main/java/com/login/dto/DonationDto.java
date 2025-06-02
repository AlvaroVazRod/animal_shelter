package com.login.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DonationDto {
    private Long id;
    private Double quantity;
    private LocalDateTime date;
    private String status;
    private String paymentMethod;
    private String stripePaymentIntentId;
    private Long userId;
    private String userName;
    private Long animalId;
    private String animalName;
}
