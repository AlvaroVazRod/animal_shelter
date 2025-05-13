package com.login.repository;

import com.login.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    Optional<Donation> findByStripePaymentIntentId(String stripePaymentIntentId);
    List<Donation> findByStatus(Donation.Status status);
    List<Donation> findByUserId(Long userId);
    List<Donation> findByStatusAndUserId(Donation.Status status, Long userId);

}
