package com.login.controller;

import com.login.model.User;
import com.login.service.UserService;
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
    public ResponseEntity<List<User>> getAll(Authentication authentication) {
        if (isAdmin(authentication)) {
            return ResponseEntity.ok(userService.getAll());
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id, Authentication authentication) {
        if (isAdmin(authentication)) {
            return userService.getById(id);
        }
        return ResponseEntity.status(403).build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserById(@PathVariable Long id, @RequestBody User userDetails, Authentication authentication) {
        if (isAdmin(authentication)) {
            return ResponseEntity.ok(userService.update(id, userDetails));
        }
        return ResponseEntity.status(403).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id, Authentication authentication) {
        if (isAdmin(authentication)) {
            userService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(403).build();
    }


    @GetMapping("/me")
    public ResponseEntity<User> getMyUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getAll().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);

        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@RequestBody User userDetails, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getAll().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);

        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(userService.update(user.getId(), userDetails));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getAll().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);

        if (user == null) return ResponseEntity.notFound().build();

        userService.delete(user.getId());
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    }
}
