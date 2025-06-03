package com.login.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Data transfer object representing a user")
public class UserDto {

    @Schema(description = "Unique identifier of the user", example = "1")
    private Long id;

    @NotBlank
    @Schema(description = "Unique username for login", example = "johndoe")
    private String username;

    @Email
    @Schema(description = "User's email address", example = "johndoe@example.com")
    private String email;

    @Schema(description = "Role assigned to the user", example = "USER")
    private String role;

    @Size(max = 100)
    @Schema(description = "First name of the user", example = "John")
    private String name;

    @Schema(description = "Last name of the user", example = "Doe")
    private String surname;

    @Schema(description = "Phone number of the user", example = "+34 600 123 456")
    private String phone;

    @Schema(description = "Filename or path to the profile image", example = "profile_john.jpg")
    private String image;

    @Schema(description = "Account status", example = "active")
    private String status;

    @Schema(description = "User newsletter subscription status", example = "true")
    private boolean newsletter;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    public boolean isNewsletter() {
        return newsletter;
    }

    public void setNewsletter(boolean newsletter) {
        this.newsletter = newsletter;
    }
}
