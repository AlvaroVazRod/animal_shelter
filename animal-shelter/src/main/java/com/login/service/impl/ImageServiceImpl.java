package com.login.service.impl;

import com.login.model.User;
import com.login.repository.UserRepository;
import com.login.service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {

    private final Path userUploadDir = Paths.get("uploads/users");
    private final Path animalUploadDir = Paths.get("uploads/animals");
    private final UserRepository userRepository;

    public ImageServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        try {
            Files.createDirectories(userUploadDir);
            Files.createDirectories(animalUploadDir);
        } catch (IOException e) {
            throw new RuntimeException("No se pudieron crear los directorios de carga", e);
        }
    }

    @Override
    public ResponseEntity<String> uploadUserImage(MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        if (file.isEmpty()) return ResponseEntity.badRequest().body("El archivo está vacío");

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        User user = optionalUser.get();
        String safeFileName = username.replaceAll("[^a-zA-Z0-9_-]", "_") + getExtension(file.getOriginalFilename());
        Path targetLocation = userUploadDir.resolve(safeFileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            user.setImage(safeFileName);
            userRepository.save(user);
            return ResponseEntity.ok("Imagen guardada como: " + safeFileName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al subir la imagen");
        }
    }


    @Override
    public ResponseEntity<String> uploadAnimalImage(MultipartFile file) {
        return handleUpload(file, animalUploadDir);
    }

    @Override
    public ResponseEntity<Resource> getUserImage(String filename) {
        return serveImage(userUploadDir.resolve(filename));
    }

    @Override
    public ResponseEntity<Resource> getAnimalImage(String filename) {
        return serveImage(animalUploadDir.resolve(filename));
    }

    private ResponseEntity<String> handleUpload(MultipartFile file, Path targetDir) {
        try {
            if (file.isEmpty()) return ResponseEntity.badRequest().body("El archivo está vacío");

            String fileName = Path.of(file.getOriginalFilename()).getFileName().toString();
            Path targetLocation = targetDir.resolve(fileName);

            if (Files.exists(targetLocation)) {
                return ResponseEntity.status(409).body("El archivo ya existe");
            }

            Files.copy(file.getInputStream(), targetLocation);
            return ResponseEntity.ok("Imagen subida: " + fileName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al subir la imagen");
        }
    }

    private ResponseEntity<Resource> serveImage(Path filePath) {
        try {
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null) return "";
        int dotIndex = originalFilename.lastIndexOf('.');
        return (dotIndex >= 0) ? originalFilename.substring(dotIndex) : "";
    }
}
