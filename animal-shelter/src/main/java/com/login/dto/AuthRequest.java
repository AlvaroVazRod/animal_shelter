package com.login.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for user authentication")
public class AuthRequest {

    @Schema(description = "User's username", example = "johndoe")
    private String username;

    @Schema(description = "User's password", example = "securePassword123")
    private String password;

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
