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

    public Long getId() { return id; }
    public void setId(long id) {this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email;}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username;}

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarURL) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt; }

    public LocalDateTime getLastLoginAt() { return LastLoginAt; }
    public void setLastLoginAt(LastLoginAt) { this.LastLoginAt = LastLoginAt; }

    public String getUserData() { return userData; }
    public void setUserData(String userData) { this.userData = userData; }

    public String getGmailAccessToken() { return GmailAccessToken; }
    public void setGmailAccessToken(String gmailAccessToken) {this.gmailAccessToken = gmailAccessToken; }

    public String getGmailRefreshToken() { return gmailRefreshToken; }
    public void setGmailRefreshToken(String gmailRefreshToken) {this.gmailRefreshToken = gmailRefreshToken; }

    public LocalDateTime getTokenExpiry() { return tokenExpiry; }
    public void setTokenExpiry(LocalDateTime tokenExpiry) {this.tokenExpiry = tokenExpiry; }
    
}
