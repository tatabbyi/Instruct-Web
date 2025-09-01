package com.Tatabbyi.instruct.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    private String avatarUrl;

    @Column(nullable = false)
    private LocalDateTime crteatedAt;

    private localDateTime lastLoginAt;

    @Column(columnDefinition = "TEXT")
    private String userData;

    private String gmailAccessToken;
    private String gmailRefreshToken;
    private LocalDateTime tokenExpiry;

    public User() {}

    public User(String email, String username) {
        this.email = email;
        this.username = username;
        this.createdAt = LocalDateTime.now();
    }
    
}
