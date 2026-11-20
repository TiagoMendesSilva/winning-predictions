package br.com.tech.guesses.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShieldApiSoccerResponse {
        private String get;
        private Integer results;
        private List<ShieldItemResponse> response;
}
