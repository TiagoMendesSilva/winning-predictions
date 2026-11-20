package br.com.tech.guesses.dto.fixture;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatusResponse {
    @JsonProperty("long")
    private String longField;

    @JsonProperty("short")
    private String shortField;

    private Integer elapsed;
    private Integer extra;
}
