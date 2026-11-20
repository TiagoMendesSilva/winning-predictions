package br.com.tech.guesses.service;

import br.com.tech.guesses.builder.PredictionBuilder;
import br.com.tech.guesses.dto.prediction.PredictionDTO;
import br.com.tech.guesses.dto.prediction.PredictionResponseDTO;
import br.com.tech.guesses.entity.Fixture;
import br.com.tech.guesses.entity.Prediction;
import br.com.tech.guesses.entity.User;
import br.com.tech.guesses.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PredictionService {
    private static final int DEADLINE_MINUTES = 10;

    private final UserService userService;
    private final FixtureService fixtureService;
    private final PredictionRepository predictionRepository;
    private final PredictionBuilder predictionBuilder;

    @Value("${app.predictions.allow-expired}")
    private boolean allowPredictionsExpired;

    @Transactional
    public void create(PredictionDTO dto, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        Fixture fixture = fixtureService.findById(dto.getFixtureId());
        boolean existsPrediction = predictionRepository.existsByUser_IdAndFixture_Id(user.getId(), fixture.getId());
        if (existsPrediction) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Você já registrou um palpite para esta partida");
        }
        if(!allowPredictionsExpired && deadlinePassed(fixture)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O prazo para palpitar foi encerrado");
        }
        try {
           predictionRepository.save(predictionBuilder.build(dto, user, fixture));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um palpite para esta partida");
        }
    }

    private boolean deadlinePassed(Fixture fixture) {
        LocalDateTime kickoff = fixture.getDate();
        if(kickoff == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "A partida não possui data de início");
        }
        LocalDateTime deadline = kickoff.minusMinutes(DEADLINE_MINUTES);
        LocalDateTime now = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
        return !now.isBefore(deadline);
    }

    @Transactional(readOnly = true)
    public List<PredictionResponseDTO> findAllByUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        List<Prediction> predictionsUser = predictionRepository.findAllByUser_IdOrderByCreatedAtDesc(user.getId());
        return predictionsUser.stream().map(predictionBuilder::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PredictionResponseDTO findByFixtureId(Long fixtureId, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        Prediction prediction = predictionRepository.findByUser_IdAndFixture_Id(user.getId(), fixtureId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum palpite encontrado para esta partida"));
        return predictionBuilder.toResponse(prediction);
    }

    public List<Prediction> findAllForRanking(Long leagueId, Integer season, List<String> finishedStatuses) {
        return predictionRepository.findAllForRanking(leagueId, season, finishedStatuses);
    }
}
