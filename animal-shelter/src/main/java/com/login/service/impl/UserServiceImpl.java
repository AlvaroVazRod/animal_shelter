package com.login.service.impl;

import com.login.dto.UserDto;
import com.login.exception.ResourceNotFoundException;
import com.login.model.User;
import com.login.repository.UserRepository;
import com.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name());
        dto.setImage(user.getImage());
        return dto;
    }

    private User mapToEntity(UserDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());
        user.setPhone(dto.getPhone());
        user.setRole(User.Role.valueOf(dto.getRole()));
        user.setImage(dto.getImage());
        return user;
    }

    @Override
    public List<UserDto> getAllDto() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<UserDto> getByIdSecure(Long id, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                || user.getUsername().equals(auth.getName())) {
            return ResponseEntity.ok(mapToDto(user));
        }
        return ResponseEntity.status(403).build();
    }
    
    @Override
    public ResponseEntity<UserDto> updateSecure(Long id, UserDto dto, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                || user.getUsername().equals(auth.getName())) {
            user.setEmail(dto.getEmail());
            user.setName(dto.getName());
            user.setSurname(dto.getSurname());
            user.setPhone(dto.getPhone());
            user.setImage(dto.getImage());
            return ResponseEntity.ok(mapToDto(userRepository.save(user)));
        }
        return ResponseEntity.status(403).build();
    }

    @Override
    public ResponseEntity<Void> deleteSecure(Long id, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                || user.getUsername().equals(auth.getName())) {
            userRepository.delete(user);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(403).build();
    }

    @Override
    public ResponseEntity<UserDto> updateUserImage(Long id, String filename, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                || user.getUsername().equals(auth.getName())) {
            user.setImage(filename);
            return ResponseEntity.ok(mapToDto(userRepository.save(user)));
        }
        return ResponseEntity.status(403).build();
    }
    
    @Override
    public ResponseEntity<UserDto> getByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return ResponseEntity.ok(mapToDto(user));
    }

}