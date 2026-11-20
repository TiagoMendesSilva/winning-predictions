package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.prediction.PredictionDTO;
import br.com.tech.guesses.dto.prediction.PredictionResponseDTO;
import br.com.tech.guesses.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/predictions")
public class PredictionController {
    private final PredictionService predictionService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PredictionDTO dto, Authentication authentication) {
        predictionService.create(dto, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping(value = "/user")
    public ResponseEntity<List<PredictionResponseDTO>> findAllByUser(Authentication authentication) {
        return ResponseEntity.ok(predictionService.findAllByUser(authentication));
    }

    @GetMapping(value = "/fixture/{fixtureId}")
    public ResponseEntity<PredictionResponseDTO> findByFixtureId(@PathVariable Long fixtureId, Authentication authentication) {
        return ResponseEntity.ok(predictionService.findByFixtureId(fixtureId, authentication));
    }
}
