package com.login.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.login.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@Tag(name = "Images", description = "Endpoints for uploading and retrieving images for users, animals, and tags")
@RestController
@RequestMapping("/images")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @Operation(summary = "Upload user image", description = "Uploads a profile image for a user")
    @ApiResponse(responseCode = "200", description = "User image uploaded successfully")
    @PostMapping("/upload/user")
    public ResponseEntity<String> uploadUserImage(@RequestParam("file") MultipartFile file) {
        return imageService.uploadUserImage(file);
    }

    @Operation(summary = "Upload animal image", description = "Uploads an image for an animal")
    @ApiResponse(responseCode = "200", description = "Animal image uploaded successfully")
    @PostMapping("/upload/animal")
    public ResponseEntity<String> uploadAnimalImage(@RequestParam("file") MultipartFile file) {
        return imageService.uploadAnimalImage(file);
    }

    @Operation(summary = "Get user image", description = "Retrieves a user image by filename")
    @ApiResponse(responseCode = "200", description = "User image retrieved successfully")
    @GetMapping("/user/{filename:.+}")
    public ResponseEntity<Resource> getUserImage(@PathVariable String filename) {
        return imageService.getUserImage(filename);
    }

    @Operation(summary = "Get animal image", description = "Retrieves an animal image by filename")
    @ApiResponse(responseCode = "200", description = "Animal image retrieved successfully")
    @GetMapping("/animal/{filename:.+}")
    public ResponseEntity<Resource> getAnimalImage(@PathVariable String filename) {
        return imageService.getAnimalImage(filename);
    }

    @Operation(summary = "Upload tag icon", description = "Uploads an icon image for a tag")
    @ApiResponse(responseCode = "200", description = "Tag icon uploaded successfully")
    @PostMapping("/upload/tag/{tagId}")
    public ResponseEntity<String> uploadTagIcon(
            @PathVariable Long tagId,
            @RequestParam("file") MultipartFile file) {
        return imageService.uploadTagIcon(tagId, file);
    }
}
