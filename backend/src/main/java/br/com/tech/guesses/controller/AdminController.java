package br.com.tech.guesses.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "/verify")
public class AdminController {

    @GetMapping(value = "/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin() {
        return "Area administrativa";
    }

    @GetMapping(value = "/user")
    @PreAuthorize("hasRole('USER')")
    public String user() {
        return "Area do usuário";
    }

    @GetMapping(value = "/authorities")
    public String authorities(Authentication authentication) {
        System.out.println(authentication.getAuthorities());
        return authentication.getAuthorities().toString();
    }

    @GetMapping(value = "/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
