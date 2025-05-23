package com.login.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnimalImageDto {
    private Long id;
    private String filename;
    private LocalDateTime fechaSubida;
    private Long animalId;
}
