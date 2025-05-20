package com.login.controller;

import com.login.security.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/login")
	public Map<String, String> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
		String username = loginRequest.get("username");
		String password = loginRequest.get("password");

		try {
			Authentication auth = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(username, password));

			UserDetails userDetails = (UserDetails) auth.getPrincipal();
			String token = jwtUtils.generateToken(userDetails);
			String role = userDetails.getAuthorities().stream().findFirst()
					.map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", "")).orElse("USER");

			return Map.of("token", token, "role", role);

		} catch (AuthenticationException e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return Map.of("error", "Usuario o contraseña incorrectos");
		}
	}
}
