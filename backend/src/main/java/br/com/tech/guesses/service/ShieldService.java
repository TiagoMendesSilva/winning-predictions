package br.com.tech.guesses.service;

import br.com.tech.guesses.client.SoccerApiClient;
import br.com.tech.guesses.dto.ShieldApiSoccerResponse;
import br.com.tech.guesses.dto.ShieldItemResponse;
import br.com.tech.guesses.entity.Shield;
import br.com.tech.guesses.repository.ShieldRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ShieldService {

    private final SoccerApiClient soccerApiClient;
    private final ShieldRepository shieldRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ShieldApiSoccerResponse fetchAll() throws IOException, InterruptedException {

        ShieldApiSoccerResponse shieldApiSoccerResponse = soccerApiClient.fetchShieldAll();

        if (shieldApiSoccerResponse == null || shieldApiSoccerResponse.getResponse() == null) {
            return ShieldApiSoccerResponse.builder().response(Collections.emptyList()).build();
        }

        log.info("Response API: {}", objectMapper.writeValueAsString(shieldApiSoccerResponse));
        List<Shield> shields =
                shieldApiSoccerResponse.getResponse()
                        .stream()
                        .map(shield -> Shield.builder()
                                .name(shield.getName())
                                .code(shield.getCode())
                                .flag(shield.getFlag())
                                .createdAt(LocalDateTime.now())
                                .build())
                        .toList();
        shieldRepository.saveAll(shields);
        List<ShieldItemResponse> shieldsResponse = shields.stream()
                .map(shield -> ShieldItemResponse.builder()
                        .name(shield.getName())
                        .code(shield.getCode())
                        .flag(shield.getFlag())
                        .build())
                .collect(Collectors.toList());
        return ShieldApiSoccerResponse.builder()
                .get("countries")
                .results(shieldsResponse.size())
                .response(shieldsResponse)
                .build();

    }

    @Transactional(readOnly = true)
    public ShieldApiSoccerResponse findAll() {
        List<Shield> entities = shieldRepository.findAll();
        List<ShieldItemResponse> shields = entities.stream()
                .map(shield -> ShieldItemResponse.builder()
                        .name(shield.getName())
                        .code(shield.getCode())
                        .flag(shield.getFlag())
                        .build())
                .collect(Collectors.toList());
        return ShieldApiSoccerResponse.builder()
                .get("countries")
                .results(entities.size())
                .response(shields)
                .build();
    }
}
