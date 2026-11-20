package br.com.tech.guesses.dto.screen.home;

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
public class HomeScreenLeagueResponse {
    private Long id;
    private String name;
    private String country;
//    private String logo;
    private HomeScreenFixtureResponse nextFixture;
}
