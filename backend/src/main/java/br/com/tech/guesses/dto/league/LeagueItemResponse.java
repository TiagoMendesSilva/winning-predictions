package br.com.tech.guesses.dto.league;

import br.com.tech.guesses.dto.CountryData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueItemResponse {
    private LeagueData league;
    private CountryData country;
}
