package br.com.tech.guesses.service;

import br.com.tech.guesses.client.SoccerApiClient;
import br.com.tech.guesses.dto.league.LeagueApiSoccerResponse;
import br.com.tech.guesses.dto.league.LeagueResponse;
import br.com.tech.guesses.entity.League;
import br.com.tech.guesses.repository.LeagueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class LeagueService {
    private final SoccerApiClient soccerApiClient;
    private final LeagueRepository leagueRepository;

    private static final List<Long> LEAGUES_IDS =  List.of(1L, 13L, 71L, 73L);

    @Scheduled(cron = "0 0 3 * * *")
    public void syncLeagues() throws IOException, InterruptedException {
        // Teste DNS
        try {
            java.net.InetAddress address = java.net.InetAddress.getByName("media.api-sports.io");
            log.info("DNS RESOLVIDO: {}", address.getHostAddress());
        } catch (Exception e) {
            log.error("DNS NÃO RESOLVE: {}", e.getMessage());
        }
        LeagueApiSoccerResponse apiSoccerResponse = soccerApiClient.fetchAll();
        persistenceLeague(apiSoccerResponse);
    }

    @Transactional
    private void persistenceLeague(LeagueApiSoccerResponse apiSoccerResponse) {
        List<League> leagues = apiSoccerResponse.getResponse().stream()
                .map(league -> {
                    byte[] imageBytes = downloadImage(league.getLeague().getLogo());
                    return League.builder()
                            .id(league.getLeague().getId())
                            .name(league.getLeague().getName())
                            .logoUrl(league.getLeague().getLogo())
                            .logo(imageBytes)
                            .country(league.getCountry().getName())
                            .code(league.getCountry().getCode())
                            .flag(league.getCountry().getFlag())
                            .createdAt(LocalDateTime.now())
                            .build();
                }).collect(Collectors.toList());
        leagueRepository.saveAll(leagues);
    }

    @Transactional(readOnly = true)
    public List<LeagueResponse> findAll() {
//        List<League> entities = leagueRepository.findAll();
        List<League> entities = leagueRepository.findByIdIn(LEAGUES_IDS);
        return entities.stream()
                .map(entity -> LeagueResponse.builder()
                        .id(entity.getId())
                        .name(entity.getName())
                        .country(entity.getCountry())
                        .logoUrl(entity.getLogoUrl())
//                        .logo(entity.getLogo() != null
//                                ? Base64.getEncoder().encodeToString(entity.getLogo()).getBytes()
//                                : null)
                        .build())
                .collect(Collectors.toList());
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

    @Transactional(readOnly = true)
    public byte[] findLogoById(Long id) {
        League league = leagueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("League not found"));

        if(league.getLogo() == null) {
            throw new RuntimeException("Logo não encontrado para a liga: " + id);
        }
        return league.getLogo();
    }

    private String bytesToHex(byte[] bytes, int limit) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(limit, bytes.length); i++) {
            sb.append(String.format("%02X ", bytes[i]));
        }
        return sb.toString();
    }
}
