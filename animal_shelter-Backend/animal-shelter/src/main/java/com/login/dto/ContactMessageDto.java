package com.login.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactMessageDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Email(message = "Debe proporcionar un email válido")
    private String email;

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String message;
}
