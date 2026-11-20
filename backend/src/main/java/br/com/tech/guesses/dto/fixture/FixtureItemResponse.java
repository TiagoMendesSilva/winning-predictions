package br.com.tech.guesses.dto.fixture;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixtureItemResponse {
    private Long id;
    private String referee;
    private String timezone;

    @JsonIgnoreProperties(ignoreUnknown = true)
    private OffsetDateTime date;

    private Long timestamp;
    private PeriodResponse periods;
    private VenueResponse venue;
    private StatusResponse status;
}
