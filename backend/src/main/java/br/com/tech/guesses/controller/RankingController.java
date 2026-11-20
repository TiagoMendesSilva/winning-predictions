package br.com.tech.guesses.controller;

import br.com.tech.guesses.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/ranking")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping
    public ResponseEntity<List<?>> findResultLeagueAndSeason(@RequestParam Long leagueId, @RequestParam Integer season, Authentication authentication) {
        return ResponseEntity.ok(rankingService.findRanking(leagueId, season, authentication));
    }
}
