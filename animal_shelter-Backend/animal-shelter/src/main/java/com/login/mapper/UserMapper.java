package com.login.mapper;

import com.login.dto.UserDto;
import com.login.model.User;

public class UserMapper {

    public static UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setImage(user.getImage());
        dto.setNewsletter(user.isNewsletter());
        dto.setName(user.getName()); // ✅ FALTABA
        dto.setSurname(user.getSurname()); // ✅ FALTABA
        dto.setPhone(user.getPhone()); // ✅ FALTABA
        dto.setStatus(user.getStatus().name()); // ✅ FALTABA
        return dto;
    }

    public static User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setImage(dto.getImage());
        user.setNewsletter(dto.isNewsletter());
        // NOTA: no se establece la contraseña ni otros campos sensibles desde el DTO
        return user;
    }
}