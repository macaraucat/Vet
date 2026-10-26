package cl.vet.auth_service.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegistroRequest(
        @NotBlank String run,
        @NotBlank String nombre,
        @NotBlank String apellidos,
        @NotBlank @Email String email,
        @NotNull @Past LocalDate fechaNac,
        @NotBlank String region,
        @NotBlank String comuna,
        @NotBlank String direccion,
        @NotBlank @Size(min = 6) String password) {
}
