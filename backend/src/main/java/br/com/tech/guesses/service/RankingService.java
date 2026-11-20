package br.com.tech.guesses.service;

import br.com.tech.guesses.builder.RankingBuilder;
import br.com.tech.guesses.dto.ranking.RankingResponseDTO;
import br.com.tech.guesses.entity.Prediction;
import br.com.tech.guesses.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RequiredArgsConstructor
@Service
public class RankingService {

    private final UserService userService;
    private final PredictionService predictionService;
    private final RankingBuilder rankingBuilder;

    private static final List<String> FINISHED_STATUSES = List.of("FT", "AET", "PEN", "FINISHED", "MATCH_FINISHED");

    public List<?> findRanking(Long leagueId, Integer season, Authentication authentication) {
        //TODO: Validar ID do campeonato e ano
        if(leagueId == null || season == null) {
            throw new IllegalArgumentException("Campeonato e temporada são obrigatórios");
        }
        //TODO: Identificar o usuário autenticado
        User currentUser = userService.findByEmail(authentication.getName());
        //TODO: Buscar os palpites da partida
        List<Prediction> predictions = predictionService.findAllForRanking(leagueId, season, FINISHED_STATUSES);
        //TODO: Calcular os pontos de cada palpite
        Map<Long,RankingAccumulator> rankingMap = new HashMap<>();
        //TODO: Agrupar os resultados
        for(Prediction prediction : predictions) {
            User user = prediction.getUser();
            Integer predictedHome = prediction.getHomeGoals();
            Integer predictedAway = prediction.getAwayGoals();
            Integer actualHome = prediction.getFixture().getFullTimeHome();
            Integer actualAway = prediction.getFixture().getFullTimeAway();
            if(predictedHome == null || predictedAway == null || actualHome == null || actualAway == null) {
                continue;
            }
            //TODO: Calcular o aproveitamento
            RankingAccumulator accumulator = rankingMap.computeIfAbsent(user.getId(), id -> new RankingAccumulator(user));
            int points =  calculatePoints(predictedHome, predictedAway, actualHome, actualAway);
            accumulator.addPrediction(points, predictedHome, predictedAway, actualHome, actualAway);
        }
        //TODO: Ordenar os usuários
        List<RankingAccumulator> orderedRanking = new ArrayList<>(rankingMap.values());
        orderedRanking.sort(Comparator.comparingInt(RankingAccumulator::getPoints)
                .reversed()
                .thenComparing(Comparator.comparingInt(RankingAccumulator::getCorrectPredictions)
                        .reversed())
                .thenComparing(Comparator.comparingInt(RankingAccumulator::getExactPredictions)
                        .reversed())
                .thenComparing(accumulator -> accumulator.getUser().getName(),
                        String.CASE_INSENSITIVE_ORDER)
        );
        List<RankingResponseDTO> response = new ArrayList<>();
        for(int index = 0; index < orderedRanking.size(); index++) {
            RankingAccumulator accumulator = orderedRanking.get(index);
            BigDecimal accuracy = calculateAccuracy(accumulator.getCorrectPredictions(), accumulator.getTotalPredictions());
            //TODO: classe builder RankingResponseDTO
            RankingResponseDTO dto = rankingBuilder.build(index, accumulator, accuracy, currentUser);
            response.add(dto);
        }
        return response;
    }

    private BigDecimal calculateAccuracy(int correctPredictions, int totalPredictions) {
        if(totalPredictions == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(correctPredictions)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalPredictions),1, RoundingMode.HALF_UP);
    }

    private int calculatePoints(Integer predictedHome, Integer predictedAway, Integer actualHome, Integer actualAway) {
        if(predictedHome == actualHome && predictedAway == actualAway) {
            return 3;
        }
        if(Integer.compare(predictedHome, predictedAway) == Integer.compare(actualHome, actualAway)) {
            return 1;
        }
        return 0;
    }

    public static class RankingAccumulator {
        private final User user;

        private int points;
        private int totalPredictions;
        private int correctPredictions;
        private int exactPredictions;

        private RankingAccumulator(User user) {
            this.user = user;
        }

        private void addPrediction(int points, int predictedHome, int predictedAway, int actualHome, int actualAway) {
            this.points += points;
            this.totalPredictions++;
            boolean exact = predictedHome == actualHome && predictedAway == actualAway;
            if(exact) {
                this.exactPredictions++;
            }
            if(points > 0) {
                this.correctPredictions++;
            }
        }
        public User getUser(){
            return user;
        }
        public int getPoints() {
            return points;
        }
        public int getTotalPredictions() {
            return totalPredictions;
        }
        public int getCorrectPredictions() {
            return correctPredictions;
        }
        public int getExactPredictions() {
            return exactPredictions;
        }
    }
}
