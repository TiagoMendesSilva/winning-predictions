package br.com.tech.guesses.dto.fixture;

import br.com.tech.guesses.dto.GoalsResponse;
import br.com.tech.guesses.dto.league.LeagueResponse;
import br.com.tech.guesses.dto.score.ScoreResponse;
import br.com.tech.guesses.dto.team.TeamsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixtureResponse {
    private FixtureItemResponse fixture;
    private LeagueResponse league;
    private TeamsResponse teams;
    private GoalsResponse goals;
    private ScoreResponse score;
}
