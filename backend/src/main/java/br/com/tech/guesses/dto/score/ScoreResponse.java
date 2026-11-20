package br.com.tech.guesses.dto.score;

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
public class ScoreResponse {
    private ScoreItemResponse halftime;
    private ScoreItemResponse fulltime;
    private ScoreItemResponse extratime;
    private ScoreItemResponse penalty;
}
