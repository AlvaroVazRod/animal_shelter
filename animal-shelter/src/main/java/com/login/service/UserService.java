package com.login.service;

import com.login.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {

    List<UserDto> getAllDto();

    ResponseEntity<UserDto> getByIdSecure(Long id, Authentication authentication);

    ResponseEntity<UserDto> updateSecure(Long id, UserDto userDto, Authentication authentication);

    ResponseEntity<Void> deleteSecure(Long id, Authentication authentication);
}
