package br.com.tech.guesses.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PredictionDTO {
    private Long fixtureId;
    private Integer homeGoals;
    private Integer awayGoals;
}
