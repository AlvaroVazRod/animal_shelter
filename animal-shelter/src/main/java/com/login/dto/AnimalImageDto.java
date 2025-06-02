package com.login.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Schema(description = "Data transfer object representing an image associated with an animal")
public class AnimalImageDto {

    @Schema(description = "Unique identifier of the image", example = "101")
    private Long id;

    @Schema(description = "Filename or path of the uploaded image", example = "golden_retriever_1.jpg")
    private String filename;

    @Schema(description = "Date and time when the image was uploaded", example = "2024-05-20T15:30:00")
    private LocalDateTime fechaSubida;

    @Schema(description = "ID of the animal associated with this image", example = "12")
    private Long animalId;
}
