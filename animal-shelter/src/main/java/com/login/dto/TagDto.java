package com.login.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Data transfer object representing a tag or category associated with animals")
public class TagDto {

    @Schema(description = "Unique identifier of the tag", example = "101")
    private Long id;

    @Schema(description = "Name of the tag", example = "Puppy")
    private String name;

    @Schema(description = "Short description of the tag", example = "Animals younger than 1 year")
    private String description;

    @Schema(description = "Hexadecimal color used to represent the tag", example = "#FFD700")
    private String color;

    @Schema(description = "Filename or path of the icon image", example = "puppy-icon.png")
    private String icon;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
