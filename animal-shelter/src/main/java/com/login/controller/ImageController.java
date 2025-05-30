package com.login.controller;

import org.springframework.core.io.Resource;	
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.login.service.ImageService;

@RestController
@RequestMapping("/images")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageController {

	private final ImageService imageService;

	public ImageController(ImageService imageService) {
		this.imageService = imageService;
	}

	@PostMapping("/upload/user")
	public ResponseEntity<String> uploadUserImage(@RequestParam("file") MultipartFile file) {
		return imageService.uploadUserImage(file);
	}

	@PostMapping("/upload/animal")
	public ResponseEntity<String> uploadAnimalImage(@RequestParam("file") MultipartFile file) {
		return imageService.uploadAnimalImage(file);
	}

	@GetMapping("/user/{filename:.+}")
	public ResponseEntity<Resource> getUserImage(@PathVariable String filename) {
		return imageService.getUserImage(filename);
	}

	@GetMapping("/animal/{filename:.+}")
	public ResponseEntity<Resource> getAnimalImage(@PathVariable String filename) {
		return imageService.getAnimalImage(filename);
	}
	@PostMapping("/upload/tag/{tagId}")
	public ResponseEntity<String> uploadTagIcon(
	        @PathVariable Long tagId,
	        @RequestParam("file") MultipartFile file) {
	    return imageService.uploadTagIcon(tagId, file);
	}

}
