package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.AuthResponse;
import br.com.tech.guesses.dto.GoogleLoginRequest;
import br.com.tech.guesses.dto.GoogleUserInfo;
import br.com.tech.guesses.dto.UserResponse;
import br.com.tech.guesses.entity.User;
import br.com.tech.guesses.repository.UserRepository;
import br.com.tech.guesses.service.AuthService;
import br.com.tech.guesses.service.GoogleTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    private final GoogleTokenService googleTokenService;
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping(value = "/google")
    public AuthResponse login(@RequestBody GoogleLoginRequest request) throws GeneralSecurityException, IOException {
        GoogleUserInfo googleUser = googleTokenService.validateToken(request.getToken());
        return authService.authenticate(googleUser);
    }

    @GetMapping(value = "/me")
    public UserResponse me(Authentication authentication) {
        System.out.println("AUTH = " + authentication);

        if(authentication == null){
            throw new RuntimeException("Authentication nulo");
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .pictureUrl(user.getPictureUrl())
                .build();
    }
}
