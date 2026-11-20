package br.com.tech.guesses.dto.fixture;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChampionshipFixtureResponse {
    private Long id;
    private LocalDateTime date;
    private String status;

    private String homeTeam;
    private Long homeTeamId;
    private byte[] homeTeamLogo;

    private String awayTeam;
    private Long awayTeamId;
    private byte[] awayTeamLogo;

    private Integer homeScore;
    private Integer awayScore;

    // Situação do palpite do usuário autenticado
    private String predictionStatus;
}
