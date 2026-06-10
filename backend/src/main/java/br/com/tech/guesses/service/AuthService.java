package br.com.tech.guesses.service;

import br.com.tech.guesses.dto.AuthResponse;
import br.com.tech.guesses.dto.GoogleUserInfo;
import br.com.tech.guesses.entity.Role;
import br.com.tech.guesses.entity.User;
import br.com.tech.guesses.repository.UserRepository;
import br.com.tech.guesses.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse authenticate(GoogleUserInfo googleUser) throws GeneralSecurityException, IOException {
        User user = userRepository.findByEmail(googleUser.getEmail())
                .orElseGet(() -> createUser(googleUser));
        updateUser(user, googleUser);
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .pictureUrl(user.getPictureUrl())
        .build();
    }

    private void updateUser(User user, GoogleUserInfo googleUser) {
        user.setName(googleUser.getName());
        user.setPictureUrl(googleUser.getPictureUrl());
        user.setGoogleId(googleUser.getGoogleId());
    }

    private User createUser(GoogleUserInfo googleUser) {
        return User.builder()
                .email(googleUser.getEmail())
                .provider("GOOGLE")
                .createdAt(LocalDateTime.now())
                .role(Role.ROLE_USER)
        .build();
    }
}
