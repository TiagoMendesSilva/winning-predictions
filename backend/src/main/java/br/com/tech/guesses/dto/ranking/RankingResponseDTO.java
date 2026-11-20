package br.com.tech.guesses.dto.ranking;

import br.com.tech.guesses.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankingResponseDTO {
    private Integer position;
    private Long userId;
    private String name;
    private String pictureUrl;
    private Integer points;
    private Integer totalPredictions;
    private Integer correctPredictions;
    private Integer exactPredictions;
    private BigDecimal accuracy;
    private Boolean currentUser;
}
