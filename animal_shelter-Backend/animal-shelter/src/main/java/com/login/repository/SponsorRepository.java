package com.login.repository;

import com.login.model.Sponsor;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SponsorRepository extends JpaRepository<Sponsor, Long> {
    boolean existsByStripeRef(String stripeRef);
    Optional<Sponsor> findByStripeRef(String stripeRef);
    List<Sponsor> findByIdUserId(Long userId);
}
