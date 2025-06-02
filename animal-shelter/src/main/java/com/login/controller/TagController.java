package com.login.controller;

import com.login.dto.TagDto;
import com.login.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Tags", description = "Endpoints for managing tags and assigning them to animals")
@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @Operation(summary = "Get all tags", description = "Returns a list of all tags")
    @ApiResponse(responseCode = "200", description = "Tags retrieved successfully")
    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @Operation(summary = "Get tag by ID", description = "Returns a tag by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tag retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Tag not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TagDto> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.getTagById(id));
    }

    @Operation(summary = "Update a tag", description = "Updates a tag by ID, with optional icon image")
    @ApiResponse(responseCode = "200", description = "Tag updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<TagDto> updateTag(
        @PathVariable Long id,
        @RequestPart("tag") TagDto tagDto,
        @RequestPart(value = "icon", required = false) MultipartFile iconFile
    ) throws IOException {
        return ResponseEntity.ok(tagService.updateTag(id, tagDto, iconFile));
    }

    @Operation(summary = "Create a tag", description = "Creates a new tag with optional icon image")
    @ApiResponse(responseCode = "200", description = "Tag created successfully")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<TagDto> createTag(
            @RequestPart("tag") TagDto tagDto,
            @RequestPart(value = "icon", required = false) MultipartFile iconFile
    ) throws IOException {
        return ResponseEntity.ok(tagService.createTag(tagDto, iconFile));
    }

    @Operation(summary = "Delete tag", description = "Deletes a tag by ID")
    @ApiResponse(responseCode = "204", description = "Tag deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get tags for an animal", description = "Retrieves tags associated with a specific animal")
    @ApiResponse(responseCode = "200", description = "Tags retrieved successfully")
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<TagDto>> getTagsByAnimalId(@PathVariable Long animalId) {
        return ResponseEntity.ok(tagService.getTagsByAnimalId(animalId));
    }

    @Operation(summary = "Assign tag to animal", description = "Assigns a tag to an animal by ID")
    @ApiResponse(responseCode = "200", description = "Tag assigned to animal")
    @PostMapping("/animal/{animalId}/add/{tagId}")
    public ResponseEntity<Void> addTagToAnimal(@PathVariable Long animalId, @PathVariable Long tagId) {
        tagService.addTagToAnimal(animalId, tagId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Remove tag from animal", description = "Removes a tag from an animal by ID")
    @ApiResponse(responseCode = "200", description = "Tag removed from animal")
    @DeleteMapping("/animal/{animalId}/remove/{tagId}")
    public ResponseEntity<Void> removeTagFromAnimal(@PathVariable Long animalId, @PathVariable Long tagId) {
        tagService.removeTagFromAnimal(animalId, tagId);
        return ResponseEntity.ok().build();
    }
}
