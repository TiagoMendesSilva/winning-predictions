package br.com.tech.guesses.builder;

import br.com.tech.guesses.dto.fixture.CardFixtureResponse;
import br.com.tech.guesses.dto.fixture.ChampionshipFixtureResponse;
import br.com.tech.guesses.dto.fixture.FixtureItemResponse;
import br.com.tech.guesses.dto.fixture.PeriodResponse;
import br.com.tech.guesses.dto.fixture.StatusResponse;
import br.com.tech.guesses.dto.fixture.VenueResponse;
import br.com.tech.guesses.entity.Fixture;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Component
public class FixtureBuilder {
    public CardFixtureResponse toCardFixtureResponse(Fixture fixture) {
        return CardFixtureResponse.builder()
                .id(fixture.getId())
                .date(fixture.getDate())
//                .status()
//                .statusShort()
                .round(fixture.getRound())
                .homeTeam(fixture.getHomeTeam().getName())
                .awayTeam(fixture.getAwayTeam().getName())
                .homeTeamId(fixture.getHomeTeam().getId())
                .awayTeamId(fixture.getAwayTeam().getId())
                .homeTeamLogo(fixture.getHomeTeam().getLogoUrl())
                .awayTeamLogo(fixture.getAwayTeam().getLogoUrl())
                .homeGoals(fixture.getHomeGoals())
                .awayGoals(fixture.getAwayGoals())
                .build();
    }

    public List<CardFixtureResponse> toListCardFixtureResponse(List<Fixture> entities) {
        return entities.stream().map(this::toCardFixtureResponse).toList();
    }

    public List<ChampionshipFixtureResponse> toListChampionshipFixtureResponse(List<Fixture> entities, Set<Long> fixturesWithPrediction) {
        return entities.stream().map(fixture -> toChampionshipFixtureResponse(fixture, fixturesWithPrediction.contains(fixture.getId()))).toList();
    }

    private ChampionshipFixtureResponse toChampionshipFixtureResponse(Fixture fixture, boolean hasPrediction) {
        return ChampionshipFixtureResponse.builder()
                .id(fixture.getId())
                .date(fixture.getDate())
                .status(fixture.getShortField())
                .homeTeam(fixture.getHomeTeam().getName())
                .homeTeamId(fixture.getHomeTeam().getId())
                .homeTeamLogo(fixture.getHomeTeam().getLogo())
                .awayTeam(fixture.getAwayTeam().getName())
                .awayTeamId(fixture.getAwayTeam().getId())
                .awayTeamLogo(fixture.getAwayTeam().getLogo())
                .homeScore(fixture.getHomeGoals())
                .awayScore(fixture.getAwayGoals())
                .predictionStatus(hasPrediction ? "MADE" : null)
        .build();
    }
}



