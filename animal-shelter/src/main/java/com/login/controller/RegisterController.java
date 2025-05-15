package com.login.controller;

import com.login.model.User;
import com.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> userMap) {
        String username = userMap.get("username");
        String rawPassword = userMap.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return Map.of("error", "El usuario ya existe");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setEmail(userMap.get("email"));
        user.setName(userMap.get("name"));
        user.setSurname(userMap.get("surname"));
        user.setPhone(userMap.get("phone"));
        user.setCountry(userMap.get("country"));
        user.setRole(User.Role.USER);

        userRepository.save(user);

        return Map.of("message", "Usuario registrado con éxito");
    }
}
