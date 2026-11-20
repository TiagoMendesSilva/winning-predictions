package br.com.tech.guesses.builder;

import br.com.tech.guesses.dto.prediction.PredictionDTO;
import br.com.tech.guesses.dto.prediction.PredictionResponseDTO;
import br.com.tech.guesses.entity.Fixture;
import br.com.tech.guesses.entity.Prediction;
import br.com.tech.guesses.entity.Team;
import br.com.tech.guesses.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Base64;

@Component
public class PredictionBuilder {
    public Prediction build(PredictionDTO dto, User user, Fixture fixture) {
        return Prediction.builder()
            .fixture(fixture)
            .user(user)
            .homeGoals(dto.getHomeGoals())
            .awayGoals(dto.getAwayGoals())
            .createdAt(LocalDateTime.now())
        .build();
    }

    public PredictionResponseDTO toResponse(Prediction prediction) {
        Fixture fixture = prediction.getFixture();

        Team homeTeam = fixture.getHomeTeam();
        Team awayTeam = fixture.getAwayTeam();

        Integer homeScore = fixture.getFullTimeHome() != null
                ? fixture.getFullTimeHome()
                : fixture.getHomeGoals();

        Integer awayScore = fixture.getFullTimeAway() != null
                ? fixture.getFullTimeAway()
                : fixture.getAwayGoals();

        return PredictionResponseDTO.builder()

                // Dados do palpite
                .id(prediction.getId())
                .fixtureId(fixture.getId())
                .homeGoals(prediction.getHomeGoals())
                .awayGoals(prediction.getAwayGoals())
                .createdAt(prediction.getCreatedAt())

                // Dados da partida
                .leagueName(fixture.getNameLeague())
                .kickoffDate(fixture.getDate())
                .fixtureStatus(fixture.getShortField())

                // Times
                .homeTeam(homeTeam != null ? homeTeam.getName() : null)
                .awayTeam(awayTeam != null ? awayTeam.getName() : null)

                // Logos
                .homeTeamLogo(convertLogo(homeTeam))
                .awayTeamLogo(convertLogo(awayTeam))

                // Resultado
                .homeScore(homeScore)
                .awayScore(awayScore)

        .build();
    }

    private String convertLogo(Team team) {

        if (team == null) {
            return null;
        }

        byte[] logo = team.getLogo();

        if (logo != null && logo.length > 0) {
            return Base64.getEncoder().encodeToString(logo);
        }

        return null;
    }
}
