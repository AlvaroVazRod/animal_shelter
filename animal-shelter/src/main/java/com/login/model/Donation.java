package com.login.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantity;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String paymentMethod;

    private String stripePaymentIntentId;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_animal")
    private Animal animal;

    public enum Status {
        completed,
        cancelled,
        failed,
        refunded
    }
}

