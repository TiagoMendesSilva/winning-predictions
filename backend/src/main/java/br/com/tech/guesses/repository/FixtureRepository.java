package br.com.tech.guesses.repository;

import br.com.tech.guesses.entity.Fixture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FixtureRepository extends JpaRepository<Fixture, Long> {
//    Optional<Fixture> findFirstByLeagueIdAndDateAfterOrderByDateAsc(Long id, LocalDateTime now);
    Optional<Fixture> findFirstByLeagueIdOrderByDateAsc(Long id);
    Optional<Fixture> findByExternalId(Long externalId);

    List<Fixture> findByLeagueIdOrderByDateAsc(Long leagueId);

    List<Fixture> findByLeagueIdAndSeason(Long leagueId, Integer season);
}
