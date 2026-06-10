package br.com.tech.guesses.controller;

import br.com.tech.guesses.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class JwtController {

    private final JwtService jwtService;

    @GetMapping(value = "/token")
    public String token() {
        return jwtService.generateToken("tiagomendessilva85@gmail.com");
    }

    @GetMapping(value = "/email")
    public String email(@RequestParam String token) {
        return jwtService.extractEmail(token);
    }
}
