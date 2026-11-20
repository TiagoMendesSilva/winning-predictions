package br.com.tech.guesses.service;

import br.com.tech.guesses.dto.GoogleUserInfo;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RequiredArgsConstructor
@Service
public class GoogleTokenService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    public GoogleUserInfo validateToken(String token) throws GeneralSecurityException, IOException {

        System.out.println("=== DEBUG VERIFIER ===");
        System.out.println("CLIENT ID: [" + clientId + "]");
        System.out.println("TOKEN LENGTH: " + token.length());
        System.out.println("TOKEN START: " + token.substring(0, 20));

        // Testa decodificar sem verificar assinatura
        GoogleIdToken parsed = GoogleIdToken.parse(GsonFactory.getDefaultInstance(), token);
        System.out.println("PARSED ISS: " + parsed.getPayload().getIssuer());
        System.out.println("PARSED AUD: " + parsed.getPayload().getAudience());
        System.out.println("PARSED EXP: " + parsed.getPayload().getExpirationTimeSeconds());
        System.out.println("PARSED IAT: " + parsed.getPayload().getIssuedAtTimeSeconds());

        // Tempo atual do servidor
        long now = System.currentTimeMillis() / 1000;
        System.out.println("SERVER TIME NOW: " + now);
        System.out.println("TOKEN EXP: " + parsed.getPayload().getExpirationTimeSeconds());
        System.out.println("DIFERENÇA (exp - now): " + (parsed.getPayload().getExpirationTimeSeconds() - now));


        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .setAcceptableTimeSkewSeconds(86400)// Aumenta tolerância de clock para 24 horas (só para teste local)
                .build();

        GoogleIdToken idToken = verifier.verify(token);

        if(idToken == null) {
            throw new RuntimeException("Google token inválido");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        return GoogleUserInfo.builder()
                .googleId(payload.getSubject())
                .email(payload.getEmail())
                .name((String) payload.get("name"))
                .pictureUrl((String) payload.get("picture"))
        .build();
    }
}
