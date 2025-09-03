package com.Tatabbyi.instruct.service;

import com.instruct.entity.User;
import com.instruct.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service

public class UserService {

    @Autowired
    private UserRepository userRepository;
    public User createUser(String email, String username) {
        User user = new User(email, username);
        return userRepository.save(user);
    }

    public Optional<user> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void updateUserData(Long userId, String userData) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setUserData(userData);
            user.Repository.save(user);
        });
    }

    public void updateLastLogin(long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }
    
}
