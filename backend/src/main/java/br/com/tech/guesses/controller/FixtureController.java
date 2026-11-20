package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.fixture.CardFixtureResponse;
import br.com.tech.guesses.service.FixtureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/fixtures")
public class FixtureController {

    private final FixtureService fixtureService;

    @GetMapping(value = "/sync")
    public ResponseEntity<?> findAllByLeagueAndSeason() throws IOException, InterruptedException {
        return ResponseEntity.ok(fixtureService.sync());
    }

    @GetMapping(value = "/league/{leagueId}")
    public ResponseEntity<List<CardFixtureResponse>> findByLeague(@PathVariable Long leagueId) {
        return ResponseEntity.ok(fixtureService.findByLeague(leagueId));
    }

    @GetMapping
    public ResponseEntity<?> findByLeagueIdAndSeason(@RequestParam Long leagueId, Integer season, Authentication authentication) {
        return ResponseEntity.ok(fixtureService.findByLeagueIdAndSeason(leagueId, season, authentication));
    }
}
