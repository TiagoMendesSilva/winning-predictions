package br.com.tech.guesses.controller;

import br.com.tech.guesses.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }
}

