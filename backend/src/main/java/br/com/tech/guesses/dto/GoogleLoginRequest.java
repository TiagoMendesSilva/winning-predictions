package br.com.tech.guesses.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoogleLoginRequest {
    private String token;
}
