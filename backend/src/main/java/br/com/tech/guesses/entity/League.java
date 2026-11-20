package br.com.tech.guesses.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "LEAGUE", schema = "public")
public class League {

    @Id
    private Long id;

    private String name;

    private String country;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "logo", columnDefinition = "bytea")
    private byte[] logo;

    private String code;

    private String flag;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
