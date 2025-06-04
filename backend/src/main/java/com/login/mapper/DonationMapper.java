package com.login.mapper;

import com.login.dto.DonationDto;
import com.login.model.Donation;

public class DonationMapper {

    public static DonationDto toDto(Donation donation) {
        DonationDto dto = new DonationDto();
        dto.setId(donation.getId());
        dto.setQuantity(donation.getQuantity());
        dto.setDate(donation.getDate());
        dto.setStatus(donation.getStatus().name());
        dto.setPaymentMethod(donation.getPaymentMethod());
        dto.setStripePaymentIntentId(donation.getStripePaymentIntentId());

        if (donation.getUser() != null) {
            dto.setUserId(donation.getUser().getId());
            dto.setUserName(donation.getUser().getName());
        }

        if (donation.getAnimal() != null) {
            dto.setAnimalId(donation.getAnimal().getId());
            dto.setAnimalName(donation.getAnimal().getName());
        }

        return dto;
    }
}
