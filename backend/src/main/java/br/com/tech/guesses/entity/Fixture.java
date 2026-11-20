package br.com.tech.guesses.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "fixture", schema = "public")
public class Fixture {

    //Info
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="external_id", unique=true)
    private Long externalId;

    private String referee;
    private String timezone;
    private LocalDateTime  date;
    private Long timestamp;
    //Period
    private Long first;
    private Long second;
    //Venue
    @Column(name = "venue_id")
    private Long venueId;

    @Column(name = "venue_name")
    private String venueName;

    private String city;
    //Status
    @Column(name = "long_field")
    private String longField;

    @Column(name = "short_field")
    private String shortField;
    private Integer elapsed;
    private Integer extra;

    //League
    @Column(name = "league_id")
    private Long leagueId;

    @Column(name = "name_league")
    private String nameLeague;
    private String country;

    @Column(columnDefinition = "TEXT")
    private String logo;

    @Column(columnDefinition = "TEXT")
    private String flag;
    private Integer season;
    private String round;

    //Team
//    @Column(name = "team_home_id")
//    private Long teamHomeId;
//    @Column(name = "team_home_name")
//    private String teamHomeName;
//
//    @Column(name = "team_home_logo", columnDefinition = "TEXT")
//    private String teamHomeLogo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_home_id")
    private Team homeTeam;

    @Column(name = "team_home_winner")
    private Boolean teamHomeWinner;

//    @Column(name = "team_away_id")
//    private Long teamAwayId;
//
//    @Column(name = "team_away_name")
//    private String teamAwayName;
//
//    @Column(name = "team_away_logo", columnDefinition = "TEXT")
//    private String teamAwayLogo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_away_id")
    private Team awayTeam;

    @Column(name = "team_away_winner")
    private Boolean teamAwayWinner;

    //Goals
    @Column(name = "home_goals")
    private Integer homeGoals;

    @Column(name = "away_goals")
    private Integer awayGoals;

    //Results
    @Column(name = "half_time_home")
    private Integer halfTimeHome;

    @Column(name = "half_time_away")
    private Integer halfTimeAway;

    @Column(name = "full_time_home")
    private Integer fullTimeHome;

    @Column(name = "full_time_away")
    private Integer fullTimeAway;

    @Column(name = "extra_time_home")
    private Integer extraTimeHome;

    @Column(name = "extra_time_away")
    private Integer extraTimeAway;

    @Column(name = "penalty_home")
    private Integer penaltyHome;

    @Column(name = "penalty_away")
    private Integer penaltyAway;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
