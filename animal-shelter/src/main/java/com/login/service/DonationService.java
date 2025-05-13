package com.login.service;
import com.login.model.Donation;
import java.util.List;
import java.util.Optional;

public interface DonationService {
    List<Donation> getAll();
    Donation save(Donation donation);
    Optional<Donation> findByStripePaymentIntentId(String stripeId);
    List<Donation> findByStatus(String status);
    List<Donation> findByUserId(Long userId);
    List<Donation> findByStatusAndUser(String status, Long userId); // 
}
