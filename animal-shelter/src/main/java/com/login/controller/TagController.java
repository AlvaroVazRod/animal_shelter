
package com.login.controller;

import com.login.dto.TagDto;
import com.login.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDto> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.getTagById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TagDto> updateTag(
        @PathVariable Long id,
        @RequestPart("tag") TagDto tagDto,
        @RequestPart(value = "icon", required = false) MultipartFile iconFile
    ) throws IOException {
        return ResponseEntity.ok(tagService.updateTag(id, tagDto, iconFile));
    }
    
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<TagDto> createTag(
            @RequestPart("tag") TagDto tagDto,
            @RequestPart(value = "icon", required = false) MultipartFile iconFile
    ) throws IOException {
        return ResponseEntity.ok(tagService.createTag(tagDto, iconFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<TagDto>> getTagsByAnimalId(@PathVariable Long animalId) {
        return ResponseEntity.ok(tagService.getTagsByAnimalId(animalId));
    }

    @PostMapping("/animal/{animalId}/add/{tagId}")
    public ResponseEntity<Void> addTagToAnimal(@PathVariable Long animalId, @PathVariable Long tagId) {
        tagService.addTagToAnimal(animalId, tagId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/animal/{animalId}/remove/{tagId}")
    public ResponseEntity<Void> removeTagFromAnimal(@PathVariable Long animalId, @PathVariable Long tagId) {
        tagService.removeTagFromAnimal(animalId, tagId);
        return ResponseEntity.ok().build();
    }
}
