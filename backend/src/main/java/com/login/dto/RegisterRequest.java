package com.login.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user registration")
public class RegisterRequest {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Schema(description = "Unique username for the new user", example = "johndoe")
    private String username;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Debe proporcionar un correo válido")
    @Schema(description = "Email address of the user", example = "johndoe@example.com")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    @Schema(description = "Password for the new user (minimum 6 characters)", example = "securePass123")
    private String password;

    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "First name of the user", example = "John")
    private String name;

    @NotBlank(message = "El apellido es obligatorio")
    @Schema(description = "Last name of the user", example = "Doe")
    private String surname;

    @Schema(description = "Phone number of the user", example = "+34 600 123 456")
    private String phone;

    @Schema(description = "Whether the user wants to subscribe to the newsletter", example = "true")
    private boolean newsletter;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isNewsletter() {
        return newsletter;
    }

    public void setNewsletter(boolean newsletter) {
        this.newsletter = newsletter;
    }
}
