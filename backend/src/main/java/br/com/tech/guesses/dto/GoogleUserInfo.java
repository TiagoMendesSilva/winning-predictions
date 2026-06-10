package br.com.tech.guesses.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoogleUserInfo {
    private String googleId;
    private String email;
    private String name;
    private String pictureUrl;
}
