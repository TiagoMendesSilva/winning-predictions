package br.com.tech.guesses.repository;

import br.com.tech.guesses.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {
    List<League> findByIdIn(List<Long> leaguesIds);

    List<League> findAllByOrderByNameAsc();
}
