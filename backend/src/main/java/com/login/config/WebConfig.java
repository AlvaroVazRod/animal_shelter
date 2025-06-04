package com.login.config;

import java.time.Duration;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/images/animal/**")
				.addResourceLocations("file:/uploads/animals/")
				.setCacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic());

		registry.addResourceHandler("/images/user/**")
				.addResourceLocations("file:/uploads/users/")
				.setCacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic());

		registry.addResourceHandler("/images/tag/**")
				.addResourceLocations("file:/uploads/tags/")
				.setCacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic());
	}
	

}
