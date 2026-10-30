package cl.vet.auth_service.client;

import cl.vet.auth_service.dto.UsuarioClientDTO;
import cl.vet.auth_service.dto.UsuarioClientRequest;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Optional;

@Component
public class UsuarioClient {

    private final WebClient webClient;

    public UsuarioClient(@Qualifier("userWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public Optional<UsuarioClientDTO> findByEmail(String email) {
        return webClient.get()
                .uri("/api/usuarios/internal/email/{email}", email)
                .retrieve()
                .bodyToMono(UsuarioClientDTO.class)
                .onErrorComplete(WebClientResponseException.NotFound.class)   // 404 → Mono vacío
                .map(Optional::of)
                .defaultIfEmpty(Optional.empty())
                .block(Duration.ofSeconds(2));
    }

    public UsuarioClientDTO crear(UsuarioClientRequest request) {
        return webClient.post()
                .uri("/api/usuarios/internal")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(UsuarioClientDTO.class)
                .block(Duration.ofSeconds(3));
    }
}