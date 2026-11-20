package br.com.tech.guesses.repository;

import br.com.tech.guesses.entity.Shield;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShieldRepository extends JpaRepository<Shield, Long> {
}
