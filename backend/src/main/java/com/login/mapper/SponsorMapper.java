package com.login.mapper;

import com.login.dto.SponsorDto;
import com.login.model.Sponsor;

public class SponsorMapper {

    public static SponsorDto toDto(Sponsor sponsor) {
        SponsorDto dto = new SponsorDto();
        dto.setId(sponsor.getId());
        dto.setQuantity(sponsor.getQuantity());
        dto.setStatus(sponsor.getStatus());
        dto.setStripeRef(sponsor.getStripeRef());
        dto.setIdUser(sponsor.getIdUser() != null ? sponsor.getIdUser().getId() : null);
        dto.setIdAnimal(sponsor.getIdAnimal() != null ? sponsor.getIdAnimal().getId() : null);

        if (sponsor.getIdAnimal() != null) {
            dto.setAnimalName(sponsor.getIdAnimal().getName());
            dto.setAnimalImage(sponsor.getIdAnimal().getImage());
        }

        return dto;
    }
}
