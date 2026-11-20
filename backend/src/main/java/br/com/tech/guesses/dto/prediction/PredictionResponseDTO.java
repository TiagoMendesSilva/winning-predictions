package br.com.tech.guesses.dto.prediction;

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
public class PredictionResponseDTO {
    // Dados do palpite
    private Long id;
    private Long fixtureId;
    private Integer homeGoals;
    private Integer awayGoals;
    private LocalDateTime createdAt;

    // Dados da partida
    private String leagueName;
    private LocalDateTime kickoffDate;
    private String fixtureStatus;

    // Times
    private String homeTeam;
    private String awayTeam;

    // Logos em Base64
    private String homeTeamLogo;
    private String awayTeamLogo;

    // Resultado da partida
    private Integer homeScore;
    private Integer awayScore;
}
