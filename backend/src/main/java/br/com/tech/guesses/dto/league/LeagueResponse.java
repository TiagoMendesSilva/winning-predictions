package br.com.tech.guesses.dto.league;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueResponse {
    private Long id;
    private String name;
    private String country;
    private String logoUrl;

//    private byte[] logo;
    private String logo;
    private String flag;
    private Integer season;
    private String round;

}
