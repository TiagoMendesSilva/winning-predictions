package br.com.tech.guesses.dto.screen.home;

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
public class HomeScreenFixtureResponse {
    private Long id;
    private LocalDateTime date;

    private Long homeTeamId;
    private String homeTeam;
    private byte[] homeTeamLogo;

    private Long awayTeamId;
    private String awayTeam;
    private byte[] awayTeamLogo;
}
