package com.login.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    ResponseEntity<String> uploadUserImage(MultipartFile file);
    ResponseEntity<String> uploadAnimalImage(MultipartFile file);
    ResponseEntity<Resource> getUserImage(String filename);
    ResponseEntity<Resource> getAnimalImage(String filename);
}