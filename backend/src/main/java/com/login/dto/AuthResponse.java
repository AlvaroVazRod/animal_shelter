package com.login.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response object returned after successful authentication")
public class AuthResponse {

    @Schema(description = "JWT token for authenticated access", example = "eyJhbGciOiJIUzI1NiIsInR5...")
    private String token;

    @Schema(description = "User role", example = "USER")
    private String role;

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}
