package br.com.tech.guesses.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixtureData {
    //Info
    private Long id;
    private String referee;
    private String timezone;
    private LocalDateTime date;
    private Long timestamp;
    //Period
    private Long first;
    private Long second;
    //Venue
    private Long venueId;
    private String name;
    private String city;
    //Status
    private String longField;
    private String shortField;
    private Integer elapsed;
    private Integer extra;

    //League
    private Long leagueId;
    private String nameLeague;
    private String country;
    private String logo;
    private String flag;
    private Integer season;
    private String round;

    //Team
    private Long teamHomeId;
    private String teamHomeName;
    private String teamHomeLogo;
    private Boolean teamHomeWinner;
    private Long teamAwayId;
    private String teamAwayName;
    private String teamAwayLogo;
    private Boolean teamAwayWinner;

    //Goals
    private Integer home;
    private Integer away;

    //Results
    private Integer halfTimeHome;
    private Integer halfTimeAway;
    private Integer fullTimeHome;
    private Integer fullTimeAway;
    private Integer extraTimeHome;
    private Integer extraTimeAway;
    private Integer penaltyHome;
    private Integer penaltyAway;
}
