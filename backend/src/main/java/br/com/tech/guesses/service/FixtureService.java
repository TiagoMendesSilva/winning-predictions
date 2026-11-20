package br.com.tech.guesses.service;

import br.com.tech.guesses.builder.FixtureBuilder;
import br.com.tech.guesses.client.SoccerApiClient;
import br.com.tech.guesses.dto.fixture.CardFixtureResponse;
import br.com.tech.guesses.dto.fixture.ChampionshipFixtureResponse;
import br.com.tech.guesses.dto.fixture.FixtureApiSoccerResponse;
import br.com.tech.guesses.dto.fixture.FixtureItemResponse;
import br.com.tech.guesses.dto.fixture.FixtureRequest;
import br.com.tech.guesses.dto.fixture.FixtureResponse;
import br.com.tech.guesses.entity.Fixture;
import br.com.tech.guesses.entity.Prediction;
import br.com.tech.guesses.entity.Team;
import br.com.tech.guesses.entity.User;
import br.com.tech.guesses.repository.FixtureRepository;
import br.com.tech.guesses.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class FixtureService {

    private final SoccerApiClient soccerApiClient;
    private final FixtureRepository fixtureRepository;
    private final TeamService teamService;
    private final FixtureBuilder fixtureBuilder;
    private final UserService userService;
    private final PredictionRepository predictionRepository;

    @Transactional
    public FixtureApiSoccerResponse sync() throws IOException, InterruptedException {

        FixtureApiSoccerResponse fixtureApiSoccerResponse = soccerApiClient.fetchFixtures();

        if(fixtureApiSoccerResponse == null || fixtureApiSoccerResponse.getResponse() == null) {
            return FixtureApiSoccerResponse.builder().response(Collections.emptyList()).build();
        }

        fixtureApiSoccerResponse.getResponse().forEach(this::saveTeams);

        List<Fixture> fixtures = fixtureApiSoccerResponse.getResponse().stream()
                .map(this::convertToEntity)
                .toList();
        
        fixtures.forEach(this::upsert);

//        fixtureRepository.saveAll(fixtures);

        return FixtureApiSoccerResponse.builder()
                .get("fixtures")
                .results(fixtures.size())
                .response(fixtureApiSoccerResponse.getResponse())
                .build();
    }


    private void upsert(Fixture fixtureRequest) {
        fixtureRepository.findByExternalId(fixtureRequest.getExternalId())
                .ifPresentOrElse(

                        existing -> {
                            existing.setDate(fixtureRequest.getDate());
                            existing.setTimestamp(fixtureRequest.getTimestamp());

                            existing.setLongField(fixtureRequest.getLongField());
                            existing.setShortField(fixtureRequest.getShortField());
                            existing.setElapsed(fixtureRequest.getElapsed());

                            existing.setHomeGoals(fixtureRequest.getHomeGoals());
                            existing.setAwayGoals(fixtureRequest.getAwayGoals());

                            existing.setFullTimeHome(fixtureRequest.getFullTimeHome());
                            existing.setFullTimeAway(fixtureRequest.getFullTimeAway());

                            // CORREÇÃO: atualizar os relacionamentos dos times
                            existing.setHomeTeam(fixtureRequest.getHomeTeam());
                            existing.setAwayTeam(fixtureRequest.getAwayTeam());

                            existing.setTeamHomeWinner(
                                    fixtureRequest.getTeamHomeWinner()
                            );
                            existing.setTeamAwayWinner(
                                    fixtureRequest.getTeamAwayWinner()
                            );

                            existing.setUpdatedAt(LocalDateTime.now());

                            fixtureRepository.save(existing);
                        },

                        () -> {
                            fixtureRequest.setCreatedAt(LocalDateTime.now());
                            fixtureRequest.setUpdatedAt(LocalDateTime.now());

                            fixtureRepository.save(fixtureRequest);
                        }
                );
    }

/*
    private void upsert(Fixture fixtureRequest) {
        fixtureRepository.findByExternalId(fixtureRequest.getExternalId())
                .ifPresentOrElse(

                        existing -> {

                            existing.setDate(fixtureRequest.getDate());
                            existing.setTimestamp(fixtureRequest.getTimestamp());

                            existing.setLongField(fixtureRequest.getLongField());
                            existing.setShortField(fixtureRequest.getShortField());
                            existing.setElapsed(fixtureRequest.getElapsed());

                            existing.setHomeGoals(fixtureRequest.getHomeGoals());
                            existing.setAwayGoals(fixtureRequest.getAwayGoals());

                            existing.setFullTimeHome(fixtureRequest.getFullTimeHome());
                            existing.setFullTimeAway(fixtureRequest.getFullTimeAway());

                            existing.setUpdatedAt(LocalDateTime.now());

                            fixtureRepository.save(existing);
                        },

                        () -> {

                            fixtureRequest.setCreatedAt(LocalDateTime.now());
                            fixtureRequest.setUpdatedAt(LocalDateTime.now());

                            fixtureRepository.save(fixtureRequest);
                        }
                );
    }
*/



    private void saveTeams(FixtureResponse fixture) {
        Team homeTeam = teamService.save(fixture.getTeams().getHome());
        Team awayTeam = teamService.save(fixture.getTeams().getAway());
    }

    private Fixture convertToEntity(FixtureResponse fixture) {
        return Fixture.builder()
                .externalId(fixture.getFixture().getId())
                .referee(fixture.getFixture().getReferee())
                .timezone(fixture.getFixture().getTimezone())
                .date(fixture.getFixture().getDate().toLocalDateTime())
                .timestamp(fixture.getFixture().getTimestamp())

                .first(fixture.getFixture().getPeriods().getFirst())
                .second(fixture.getFixture().getPeriods().getSecond())

                .venueId(fixture.getFixture().getVenue().getId())
                .venueName(fixture.getFixture().getVenue().getName())
                .city(fixture.getFixture().getVenue().getCity())

                .longField(fixture.getFixture().getStatus().getLongField())
                .shortField(fixture.getFixture().getStatus().getShortField())
                .elapsed(fixture.getFixture().getStatus().getElapsed())
                .extra(fixture.getFixture().getStatus().getExtra())

                .leagueId(fixture.getLeague().getId())
                .nameLeague(fixture.getLeague().getName())
                .country(fixture.getLeague().getCountry())
                .logo(fixture.getLeague().getLogo())
                .flag(fixture.getLeague().getFlag())
                .season(fixture.getLeague().getSeason())
                .round(fixture.getLeague().getRound())

//                .teamHomeId(fixture.getTeams().getHome().getId())
//                .teamHomeName(fixture.getTeams().getHome().getName())
//                .teamHomeLogo(fixture.getTeams().getHome().getLogo())
                .homeTeam(teamService.findByExternalId(fixture.getTeams().getHome().getId()))
                .teamHomeWinner(fixture.getTeams().getHome().getWinner())
//                .homeTeam(teamService.save(fixture.getTeams().getHome()))

//                .teamAwayId(fixture.getTeams().getAway().getId())
//                .teamAwayName(fixture.getTeams().getAway().getName())
//                .teamAwayLogo(fixture.getTeams().getAway().getLogo())
                .awayTeam(teamService.findByExternalId(fixture.getTeams().getAway().getId()))
                .teamAwayWinner(fixture.getTeams().getAway().getWinner())
//                .awayTeam(teamService.save(fixture.getTeams().getHome()))

                .homeGoals(fixture.getGoals().getHome())
                .awayGoals(fixture.getGoals().getAway())

                .halfTimeHome(fixture.getScore().getHalftime().getHome())
                .halfTimeAway(fixture.getScore().getHalftime().getAway())
                .fullTimeHome(fixture.getScore().getFulltime().getHome())
                .fullTimeAway(fixture.getScore().getFulltime().getAway())
                .extraTimeHome(fixture.getScore().getExtratime().getHome())
                .extraTimeAway(fixture.getScore().getExtratime().getAway())
                .penaltyHome(fixture.getScore().getPenalty().getHome())
                .penaltyAway(fixture.getScore().getPenalty().getAway())

                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
        .build();
    }

    @Transactional(readOnly = true)
    public List<CardFixtureResponse> findByLeague(Long leagueId) {
        List<Fixture> fixtures = fixtureRepository.findByLeagueIdOrderByDateAsc(leagueId);
        return fixtureBuilder.toListCardFixtureResponse(fixtures);
    }

    @Transactional(readOnly = true)
    public List<ChampionshipFixtureResponse> findByLeagueIdAndSeason(Long leagueId, Integer season, Authentication authentication) {
        // 1. Identifica o usuário autenticado
        String email = authentication.getName();

        User user = userService.findByEmail(email);

        // 2. Busca as partidas do campeonato
        List<Fixture> fixtures = fixtureRepository.findByLeagueIdAndSeason(leagueId, season);
        // Evita consulta desnecessária quando não existem partidas
        if (fixtures.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. Obtém os IDs internos das partidas
        List<Long> fixtureIds = fixtures.stream()
                .map(Fixture::getId)
                .toList();

        // 4. Busca todos os palpites desse usuário para essas partidas
        List<Prediction> predictions =
                predictionRepository.findAllByUser_IdAndFixture_IdIn(
                        user.getId(),
                        fixtureIds
                );

        // 5. Monta um conjunto com os IDs das partidas que possuem palpite
        Set<Long> fixturesWithPrediction = predictions.stream()
                .map(prediction -> prediction.getFixture().getId())
                .collect(Collectors.toSet());

        // 6. Monta a resposta incluindo o status do palpite
        return fixtureBuilder.toListChampionshipFixtureResponse(
                fixtures,
                fixturesWithPrediction
        );
    }

    @Transactional(readOnly = true)
    public Fixture findById(Long fixtureId) {
        return fixtureRepository.findById(fixtureId)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
    }
}
