package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.league.LeagueResponse;
import br.com.tech.guesses.entity.League;
import br.com.tech.guesses.service.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/leagues")
public class LeagueController {

    private final LeagueService leagueService;

    @PostMapping(value = "/sync")
    public ResponseEntity<Void> sync() throws IOException, InterruptedException {
        leagueService.syncLeagues();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<LeagueResponse>> findAll() {
        return ResponseEntity.ok(leagueService.findAll());
    }

    @GetMapping(value = "/{id}/logo")
    public ResponseEntity<byte[]> getLogo(@PathVariable Long id) {
        byte[] logo = leagueService.findLogoById(id);

        if (logo == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(logo);
    }
}
