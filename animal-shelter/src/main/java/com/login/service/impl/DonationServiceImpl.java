package com.login.service.impl;
import com.login.model.Donation;
import com.login.repository.DonationRepository;
import com.login.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationServiceImpl implements DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Override
    public List<Donation> getAll() {
        return donationRepository.findAll();
    }

    @Override
    public Donation save(Donation donation) {
        return donationRepository.save(donation);
    }

    @Override
    public Optional<Donation> findByStripePaymentIntentId(String stripeId) {
        return donationRepository.findByStripePaymentIntentId(stripeId);
    }
    @Override
    public List<Donation> findByStatus(String status) {
        return donationRepository.findByStatus(Donation.Status.valueOf(status));
    }

    @Override
    public List<Donation> findByUserId(Long userId) {
        return donationRepository.findByUserId(userId);
    }

    @Override
    public List<Donation> findByStatusAndUser(String status, Long userId) {
        return donationRepository.findByStatusAndUserId(Donation.Status.valueOf(status), userId);
    }

}
