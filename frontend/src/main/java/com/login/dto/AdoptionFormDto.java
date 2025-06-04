package com.login.dto;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Data submitted by a user in the adoption form")
public class AdoptionFormDto {

    @NotBlank
    @Schema(description = "Full name of the person submitting the form", example = "Jane Doe")
    private String name;

    @NotBlank
    @Schema(description = "Email address of the user", example = "jane@example.com")
    private String email;

    @NotBlank
    @Schema(description = "Phone number of the user", example = "+34 600 123 456")
    private String phone;

    @NotBlank
    @Schema(description = "Physical address of the user", example = "1234 Elm Street, Madrid")
    private String address;

    @Schema(description = "User's current employment or profession", example = "Software Developer")
    private String employment;

    @Schema(description = "Whether the user has other pets at home", example = "true")
    private boolean hasOtherPets;

    @Schema(description = "Whether the user agrees to terms and conditions", example = "true")
    private boolean agreeToTerms;
}
