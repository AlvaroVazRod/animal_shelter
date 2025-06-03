package com.login.service;

import com.login.dto.UserDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;


public interface UserService {


    ResponseEntity<UserDto> getByIdSecure(Long id, Authentication authentication);

    ResponseEntity<UserDto> updateSecure(Long id, UserDto userDto, Authentication authentication);

    ResponseEntity<Void> deleteSecure(Long id, Authentication authentication);
    
    ResponseEntity<UserDto> updateUserImage(Long id, MultipartFile file, Authentication auth);
    
    ResponseEntity<UserDto> getByUsername(String username);

	ResponseEntity<UserDto> updateMyProfile(UserDto dto, Authentication auth);

	ResponseEntity<Page<UserDto>> getAllPaged(Pageable pageable);


}
