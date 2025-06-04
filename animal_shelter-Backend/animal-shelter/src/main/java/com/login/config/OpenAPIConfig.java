package com.login.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Animal Shelter API",
        version = "1.0",
        description = "REST API documentation for the Animal Shelter project"
    ),
    servers = @Server(url = "http://localhost:8080", description = "Local Server")
)
public class OpenAPIConfig {
}
