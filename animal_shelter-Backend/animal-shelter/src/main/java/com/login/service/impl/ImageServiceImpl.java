package com.login.service.impl;

import com.login.model.User;
import com.login.model.Tag;
import com.login.repository.UserRepository;
import com.login.repository.TagRepository;
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
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    private final Path userUploadDir = Paths.get("uploads/users");
    private final Path animalUploadDir = Paths.get("uploads/animals");
    private final Path tagUploadDir = Paths.get("uploads/tags");
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public ImageServiceImpl(UserRepository userRepository, TagRepository tagRepository) {
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        try {
            Files.createDirectories(userUploadDir);
            Files.createDirectories(animalUploadDir);
            Files.createDirectories(tagUploadDir);
        } catch (IOException e) {
            throw new RuntimeException("No se pudieron crear los directorios de carga", e);
        }
    }

    @Override
    public ResponseEntity<String> uploadUserImage(MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        if (file.isEmpty()) return ResponseEntity.badRequest().body("El archivo está vacío");
        if (!isImageValid(file)) return ResponseEntity.badRequest().body("Solo se permiten imágenes JPG y PNG");

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        User user = optionalUser.get();

        if (user.getImage() != null) {
            try {
                Files.deleteIfExists(userUploadDir.resolve(user.getImage()));
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("No se pudo eliminar la imagen anterior");
            }
        }

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
    public ResponseEntity<String> uploadTagIcon(Long tagId, MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("El archivo está vacío");
        if (!isImageValid(file)) return ResponseEntity.badRequest().body("Solo se permiten imágenes JPG y PNG");

        Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Etiqueta no encontrada"));

        if (tag.getIcon() != null) {
            try {
                Files.deleteIfExists(tagUploadDir.resolve(tag.getIcon()));
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("No se pudo eliminar el icono anterior");
            }
        }

        String filename = UUID.randomUUID() + getExtension(file.getOriginalFilename());
        Path targetLocation = tagUploadDir.resolve(filename);

        try {
            Files.copy(file.getInputStream(), targetLocation);
            tag.setIcon(filename);
            tagRepository.save(tag);
            return ResponseEntity.ok("Icono de etiqueta actualizado: " + filename);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al guardar el icono");
        }
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
            if (!isImageValid(file)) return ResponseEntity.badRequest().body("Solo se permiten imágenes JPG y PNG");

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

    private boolean isImageValid(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null &&
                (contentType.equals("image/jpeg") || contentType.equals("image/png"));
    }
}
