package com.login.repository;

import com.login.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);
	Optional<User> findByEmail(String email);
	List<User> findByNewsletterTrue();
	boolean existsByEmail(String email);


}
