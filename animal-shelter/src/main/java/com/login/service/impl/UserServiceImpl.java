package com.login.service.impl;

import com.login.model.User;
import com.login.repository.UserRepository;
import com.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public ResponseEntity<User> getById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
    @Override
    public User update(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow();
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setName(userDetails.getName());
        user.setSurname(userDetails.getSurname());
        user.setPhone(userDetails.getPhone());
        user.setCountry(userDetails.getCountry());
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

}
