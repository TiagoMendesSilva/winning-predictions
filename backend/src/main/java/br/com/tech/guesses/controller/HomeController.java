package br.com.tech.guesses.controller;

import br.com.tech.guesses.dto.screen.home.HomeScreenLeagueResponse;
import br.com.tech.guesses.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping(value = "/home")
@RestController
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<List<HomeScreenLeagueResponse>> findScreenHome() {
        return ResponseEntity.ok(homeService.findScreenHome());
    }
}
