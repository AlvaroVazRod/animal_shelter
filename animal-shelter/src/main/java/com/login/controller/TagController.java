
package com.login.controller;

import com.login.dto.TagDto;
import com.login.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<TagDto> updateTag(@PathVariable Long id, @RequestBody TagDto tagDto) {
        return ResponseEntity.ok(tagService.updateTag(id, tagDto));
    }
    
    @PostMapping
    public ResponseEntity<TagDto> createTag(@RequestBody TagDto tagDto) {
        return ResponseEntity.ok(tagService.createTag(tagDto));
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
