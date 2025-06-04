package com.login.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sponsors")
public class Sponsor {

    public enum Status {
        refunded, cancelled, failed, completed
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantity;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "stripe_ref", nullable = false, unique = true)
    private String stripeRef;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User idUser;

    @ManyToOne
    @JoinColumn(name = "id_animal")
    private Animal idAnimal;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getStripeRef() { return stripeRef; }
    public void setStripeRef(String stripeRef) { this.stripeRef = stripeRef; }

    public User getIdUser() { return idUser; }
    public void setIdUser(User idUser) { this.idUser = idUser; }

    public Animal getIdAnimal() { return idAnimal; }
    public void setIdAnimal(Animal idAnimal) { this.idAnimal = idAnimal; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
