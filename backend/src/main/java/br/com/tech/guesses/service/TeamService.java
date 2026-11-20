package br.com.tech.guesses.service;

import br.com.tech.guesses.client.SoccerApiClient;
import br.com.tech.guesses.dto.team.TeamResponse;
import br.com.tech.guesses.entity.League;
import br.com.tech.guesses.entity.Team;
import br.com.tech.guesses.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Service
public class TeamService {

    private final TeamRepository teamRepository;

    @Transactional
    public Team save(TeamResponse response) {
        log.info("Salvando time {} - {}", response.getId(), response.getName());

        return teamRepository.findByExternalId(response.getId()).orElseGet(() -> {
            Team team =  Team.builder()
                    .externalId(response.getId())
                    .name(response.getName())
                    .logo(downloadImage(response.getLogo()))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
            .build();

            return teamRepository.save(team);
        });

//        Team team = teamRepository.findByExternalId(response.getId()).orElseGet(Team::new);
//        team.setExternalId(response.getId());
//        team.setName(response.getName());
//        team.setLogoUrl(response.getLogo());
//        if(team.getLogo() == null) {
//            team.setLogo(downloadImage(response.getLogo()));
//        }
//        if(team.getCreatedAt() == null) {
//            team.setCreatedAt(LocalDateTime.now());
//        }
//        team.setUpdatedAt(LocalDateTime.now());
//        return teamRepository.save(team);
    }

    @Transactional(readOnly = true)
    public byte[] findLogoById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("League not found"));

        if(team.getLogo() == null) {
            throw new RuntimeException("Logo não encontrado para a liga: " + id);
        }
        return team.getLogo();
    }

    private byte[] downloadImage(String url) {
        try {
            if (url == null || url.isBlank()) {
                log.warn("URL nula ou vazia");
                return null;
            }
            log.info("Baixando imagem: {}", url);

            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setConnectTimeout(5000);
            factory.setReadTimeout(5000);

            RestTemplate restTemplate = new RestTemplate(factory);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url, HttpMethod.GET, null, byte[].class
            );

            log.info("Content-Type: {}", response.getHeaders().getContentType());
            log.info("Bytes baixados: {}", response.getBody() != null ? response.getBody().length : "NULL");

            log.info("PRIMEIROS BYTES HEX: {}",
                    response.getBody() != null
                            ? bytesToHex(response.getBody(), 10)
                            : "NULL");

            return response.getBody();
        } catch (Exception e) {
            log.warn("Erro ao baixar imagem: {} - {}", url, e.getMessage());
            return null;
        }
    }

    private String bytesToHex(byte[] bytes, int limit) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(limit, bytes.length); i++) {
            sb.append(String.format("%02X ", bytes[i]));
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public Team findByExternalId(Long externalId) {
        return teamRepository.findByExternalId(externalId)
                .orElseThrow(() -> new RuntimeException("Team não encontrado " + externalId));
    }
}
