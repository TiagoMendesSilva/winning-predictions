package br.com.tech.guesses.builder;

import br.com.tech.guesses.dto.ranking.RankingResponseDTO;
import br.com.tech.guesses.entity.User;
import br.com.tech.guesses.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Component
public class RankingBuilder {
    public RankingResponseDTO build(int index, RankingService.RankingAccumulator accumulator, BigDecimal accuracy, User currentUser) {
        return RankingResponseDTO.builder()
                .position(index + 1)
                .userId(accumulator.getUser().getId())
                .name(accumulator.getUser().getName())
                .pictureUrl(accumulator.getUser().getPictureUrl())
                .points(accumulator.getPoints())
                .totalPredictions(accumulator.getTotalPredictions())
                .correctPredictions(accumulator.getCorrectPredictions())
                .exactPredictions(accumulator.getExactPredictions())
                .accuracy(accuracy)
                .currentUser(accumulator.getUser().getId().equals(currentUser.getId()))
        .build();
    }
}
