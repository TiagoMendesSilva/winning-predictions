package br.com.tech.guesses.repository;

import br.com.tech.guesses.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    boolean existsByUser_IdAndFixture_Id(Long userId, Long fixtureId);

    Optional<Prediction> findByUser_IdAndFixture_Id(Long userId, Long fixtureId);

    List<Prediction> findAllByUser_IdOrderByCreatedAtDesc(Long id);

    List<Prediction> findAllByUser_IdAndFixture_IdIn(Long userId,List<Long> fixtureIds);

    @Query("""
        SELECT entity FROM Prediction entity
        JOIN FETCH entity.user user
        JOIN FETCH entity.fixture fixture
        WHERE fixture.leagueId = :leagueId
            AND fixture.season = :season
            AND UPPER(fixture.shortField) IN :finishedStatuses
            AND fixture.fullTimeHome IS NOT NULL
            AND fixture.fullTimeAway IS NOT NULL
            AND entity.homeGoals IS NOT NULL
            AND entity.awayGoals IS NOT NULL
    """)
    List<Prediction> findAllForRanking(@Param("leagueId") Long leagueId, @Param("season") Integer season, @Param("finishedStatuses") List<String> finishedStatuses);
}
