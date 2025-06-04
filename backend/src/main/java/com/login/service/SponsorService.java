package com.login.service;

import com.login.dto.SponsorDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SponsorService {
	List<SponsorDto> getSponsorsByUsername(String username);
    ResponseEntity<Void> cancelSponsor(Long sponsorId, String username);
}
