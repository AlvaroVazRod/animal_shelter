package com.login.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdoptionFormDto {
    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    private String employment;

    private boolean hasOtherPets;

    private boolean agreeToTerms;
}
