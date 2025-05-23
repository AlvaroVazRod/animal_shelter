package com.login.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/animal/**")
                .addResourceLocations("file:///C:/Users/ALVARO/git/repository/animal-shelter/uploads/animals/");
        System.out.println("Ruta absoluta: " + new File("uploads/animals/luna.jpg").getAbsolutePath());
    }

}
