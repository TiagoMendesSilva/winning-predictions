package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.ShieldApiSoccerResponse;
import br.com.tech.guesses.service.ShieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/shields")
public class ShieldController {

    private final ShieldService shieldService;

    @GetMapping(value = "/sync")
    public ResponseEntity<ShieldApiSoccerResponse> fetchAll() throws IOException, InterruptedException {
        return ResponseEntity.ok(shieldService.fetchAll());
    }

    @GetMapping
    public ResponseEntity<ShieldApiSoccerResponse> findAll() {
        return ResponseEntity.ok(shieldService.findAll());
    }
}
