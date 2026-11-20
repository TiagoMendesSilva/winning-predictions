package br.com.tech.guesses.service;

import br.com.tech.guesses.dto.screen.home.HomeScreenFixtureResponse;
import br.com.tech.guesses.dto.screen.home.HomeScreenLeagueResponse;
import br.com.tech.guesses.entity.Fixture;
import br.com.tech.guesses.entity.League;
import br.com.tech.guesses.repository.FixtureRepository;
import br.com.tech.guesses.repository.LeagueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class HomeService {

    private final LeagueRepository leagueRepository;
    private final FixtureRepository fixtureRepository;

    @Transactional(readOnly = true)
    public List<HomeScreenLeagueResponse> findScreenHome() {
         League league = leagueRepository.findById(71L).orElseThrow(() -> new RuntimeException("league not found"));
//        return leagueRepository.findAllByOrderByNameAsc().stream().map(this::toResponse).toList();

        return List.of(toResponse(league));
    }

    private HomeScreenLeagueResponse toResponse(League league) {
//        Optional<Fixture> nextFixture = fixtureRepository.findFirstByLeagueIdAndDateAfterOrderByDateAsc(league.getId(), LocalDateTime.now());
        Optional<Fixture> nextFixture = fixtureRepository.findFirstByLeagueIdOrderByDateAsc(league.getId());
        HomeScreenFixtureResponse fixtureResponse = null;

        if(nextFixture.isPresent()) {
            Fixture fixture = nextFixture.get();
            fixtureResponse = HomeScreenFixtureResponse.builder()
                    .id(fixture.getId())
                    .date(fixture.getDate())
                    .homeTeamId(fixture.getHomeTeam().getId())
                    .homeTeam(fixture.getHomeTeam().getName())
                    .homeTeamLogo(fixture.getHomeTeam().getLogo())
                    .awayTeamId(fixture.getAwayTeam().getId())
                    .awayTeam(fixture.getAwayTeam().getName())
                    .awayTeamLogo(fixture.getAwayTeam().getLogo())
            .build();
        }

        return HomeScreenLeagueResponse.builder()
                .id(league.getId())
                .name(league.getName())
                .country(league.getCountry())
                //.logo(league.getLogoUrl())
                .nextFixture(fixtureResponse)
        .build();
    }
}
