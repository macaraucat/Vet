package cl.vet.auth_service.dto;

public record AuthResponse(
        String token,
        String tipo) {
}