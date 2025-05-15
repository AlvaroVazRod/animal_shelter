package com.login;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.login.config.JwtProperties;
import com.login.config.StripeProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class,StripeProperties.class})

public class AnimalShelterApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnimalShelterApplication.class, args);
	}


}
