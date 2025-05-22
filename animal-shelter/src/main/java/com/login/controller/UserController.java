package com.login.controller;

import com.login.dto.UserDto;	
import com.login.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDto> getAll() {
        return userService.getAllDto();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id, Authentication authentication) {
        return userService.getByIdSecure(id, authentication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id,
                                          @Valid @RequestBody UserDto userDto,
                                          Authentication authentication) {
        return userService.updateSecure(id, userDto, authentication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        return userService.deleteSecure(id, authentication);
    }
    @PutMapping("/{id}/image")
    public ResponseEntity<UserDto> updateUserImage(@PathVariable Long id,
                                                   @RequestParam String image,
                                                   Authentication authentication) {
        return userService.updateUserImage(id, image, authentication);
    }
}
