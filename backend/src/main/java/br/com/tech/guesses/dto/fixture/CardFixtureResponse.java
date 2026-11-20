package br.com.tech.guesses.dto.fixture;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardFixtureResponse {
    private Long id;
    private LocalDateTime date;
    private String status;
    private String statusShort;
    private String round;
    private String homeTeam;
    private String awayTeam;
    private Long homeTeamId;
    private Long awayTeamId;
    private String homeTeamLogo;
    private String awayTeamLogo;
    private Integer homeGoals;
    private Integer awayGoals;
}
