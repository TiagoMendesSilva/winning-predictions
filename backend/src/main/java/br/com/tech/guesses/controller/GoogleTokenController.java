package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.GoogleLoginRequest;
import br.com.tech.guesses.dto.GoogleUserInfo;
import br.com.tech.guesses.service.GoogleTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/google")
public class GoogleTokenController {
    private final GoogleTokenService googleTokenService;

    @PostMapping(value = "/validate")
    public GoogleUserInfo validate(@RequestBody GoogleLoginRequest request) throws GeneralSecurityException, IOException {
        return googleTokenService.validateToken(request.getToken());
    }
}
