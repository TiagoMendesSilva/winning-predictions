package br.com.tech.guesses.dto.fixture;

import br.com.tech.guesses.dto.FixtureData;
import br.com.tech.guesses.entity.Fixture;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixtureApiSoccerResponse {
    private String get;
    private Integer results;
    private List<FixtureResponse> response;
}
