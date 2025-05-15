package com.login.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users") 
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private String name;
    private String surname;
    private String phone;
    private String country;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
       USER, ADMIN
    }
}
