package br.com.tech.guesses.client;

import br.com.tech.guesses.dto.fixture.FixtureApiSoccerResponse;
import br.com.tech.guesses.dto.league.LeagueApiSoccerResponse;
import br.com.tech.guesses.dto.ShieldApiSoccerResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RequiredArgsConstructor
@Component
public class SoccerApiClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${football.api.url}")
    private String apiFootballUrl;

    @Value("${football.api.key}")
    private String apiFootballKey;


    public LeagueApiSoccerResponse fetchAll() throws IOException, InterruptedException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiFootballUrl +"/leagues"))
                .header("x-apisports-key", apiFootballKey)
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        return objectMapper.readValue(
                response.body(),
                LeagueApiSoccerResponse.class
        );
    }

    public ShieldApiSoccerResponse fetchShieldAll() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiFootballUrl + "/countries"))
                .header("x-apisports-key", apiFootballKey)
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        return objectMapper.readValue(
                response.body(),
                ShieldApiSoccerResponse.class
        );
    }

    public FixtureApiSoccerResponse fetchFixtures() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiFootballUrl + "/fixtures?league=71&season=2024"))
                .header("x-apisports-key", apiFootballKey)
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        return objectMapper.readValue(
                response.body(),
                FixtureApiSoccerResponse.class
        );

    }
}
