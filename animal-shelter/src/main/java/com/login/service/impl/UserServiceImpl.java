package com.login.service.impl;

import com.login.dto.UserDto;
import com.login.exception.ResourceNotFoundException;
import com.login.mapper.UserMapper;
import com.login.model.User;
import com.login.repository.UserRepository;
import com.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public List<UserDto> getAllDto() {
		return userRepository.findAll().stream().map(UserMapper::toDto).collect(Collectors.toList());
	}

	@Override
	public ResponseEntity<UserDto> getByIdSecure(Long id, Authentication auth) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
		if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
				|| user.getUsername().equals(auth.getName())) {
			return ResponseEntity.ok(UserMapper.toDto(user));
		}
		return ResponseEntity.status(403).build();
	}
	
	@Override
	public ResponseEntity<UserDto> updateMyProfile(UserDto dto, Authentication auth) {
	    User user = userRepository.findByUsername(auth.getName())
	            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
	    if (!user.getEmail().equals(dto.getEmail())) {
	        boolean emailEnUso = userRepository.existsByEmail(dto.getEmail());
	        if (emailEnUso) {
	            throw new IllegalArgumentException("El correo electrónico ya está en uso por otro usuario.");
	        }
	    }
	    user.setName(dto.getName());
	    user.setSurname(dto.getSurname());
	    user.setEmail(dto.getEmail());
	    user.setPhone(dto.getPhone());
	    user.setNewsletter(dto.isNewsletter());

	    return ResponseEntity.ok(UserMapper.toDto(userRepository.save(user)));
	}


	@Override
	public ResponseEntity<UserDto> updateSecure(Long id, UserDto dto, Authentication auth) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
		if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
				|| user.getUsername().equals(auth.getName())) {
			user.setUsername(dto.getUsername());
			user.setEmail(dto.getEmail());
			user.setName(dto.getName());
			user.setSurname(dto.getSurname());
			user.setPhone(dto.getPhone());
			user.setStatus(User.UserStatus.valueOf(dto.getStatus()));
			return ResponseEntity.ok(UserMapper.toDto(userRepository.save(user)));
		}
		return ResponseEntity.status(403).build();
	}

	@Override
	public ResponseEntity<Void> deleteSecure(Long id, Authentication auth) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
		if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
				|| user.getUsername().equals(auth.getName())) {
			if (user.getImage() != null) {
				try {
					Files.deleteIfExists(Paths.get("uploads/users", user.getImage()));
				} catch (IOException e) {
					throw new RuntimeException("Error al eliminar imagen anterior", e);
				}
			}
			userRepository.delete(user);
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.status(403).build();
	}

	@Override
	public ResponseEntity<UserDto> updateUserImage(Long id, MultipartFile file, Authentication auth) {
	    User user = userRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

	    if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
	            || user.getUsername().equals(auth.getName())) {
	        if (user.getImage() != null) {
	            try {
	                Files.deleteIfExists(Paths.get("uploads/users", user.getImage()));
	            } catch (IOException e) {
	                throw new RuntimeException("Error al eliminar imagen anterior", e);
	            }
	        }
	        String filename = saveImageFile(file, "users");
	        user.setImage(filename);
	        return ResponseEntity.ok(UserMapper.toDto(userRepository.save(user)));
	    }
	    return ResponseEntity.status(403).build();
	}

	@Override
	public ResponseEntity<UserDto> getByUsername(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
		return ResponseEntity.ok(UserMapper.toDto(user));
	}

	private void validateImageFile(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
			throw new IllegalArgumentException("Solo se permiten imágenes JPG o PNG.");
		}
	}

	private String saveImageFile(MultipartFile file, String folder) {
		validateImageFile(file);
		try {
			String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
			Path directory = Paths.get("uploads", folder);
			if (!Files.exists(directory)) {
				Files.createDirectories(directory);
			}
			Path path = directory.resolve(filename);
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
			return filename;
		} catch (IOException e) {
			throw new RuntimeException("Error al guardar la imagen", e);
		}
	}
}
