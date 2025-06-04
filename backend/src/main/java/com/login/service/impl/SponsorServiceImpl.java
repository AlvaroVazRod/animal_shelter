package com.login.service.impl;

import com.login.dto.SponsorDto;
import com.login.exception.ResourceNotFoundException;
import com.login.mapper.SponsorMapper;
import com.login.model.Sponsor;
import com.login.model.User;
import com.login.repository.SponsorRepository;
import com.login.repository.UserRepository;
import com.login.service.SponsorService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SponsorServiceImpl implements SponsorService {

    private final SponsorRepository sponsorRepository;
    private final UserRepository userRepository;

    public SponsorServiceImpl(SponsorRepository sponsorRepository, UserRepository userRepository) {
        this.sponsorRepository = sponsorRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<SponsorDto> getSponsorsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return sponsorRepository.findByIdUserId(user.getId())
                .stream()
                .map(SponsorMapper::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public ResponseEntity<Void> cancelSponsor(Long sponsorId, String username) {
        Sponsor sponsor = sponsorRepository.findById(sponsorId)
                .orElseThrow(() -> new ResourceNotFoundException("Apadrinamiento no encontrado"));

        if (!sponsor.getIdUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }

        sponsor.setStatus(Sponsor.Status.cancelled);
        sponsorRepository.save(sponsor);

        return ResponseEntity.noContent().build();
    }
}
