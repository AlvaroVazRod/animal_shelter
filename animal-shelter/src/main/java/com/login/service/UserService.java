package com.login.service;

import com.login.model.User;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface UserService {
    List<User> getAll();
    ResponseEntity<User> getById(Long id);
    User save(User user);
    User update(Long id, User user);
    void delete(Long id);
    User findByUsername(String username);

}
