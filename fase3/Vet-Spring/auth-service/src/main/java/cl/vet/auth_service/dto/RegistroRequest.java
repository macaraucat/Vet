package cl.vet.auth_service.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegistroRequest(
        @NotBlank @Size(max = 9) String run,
        @NotBlank @Size(max = 30) String nombre,
        @NotBlank @Size(max = 30) String apellidos,
        @NotBlank @Email @Size(max = 40) String email,
        @NotNull @Past LocalDate fechaNac,
        @NotBlank @Size(max = 40) String region,
        @NotBlank @Size(max = 30) String comuna,
        @NotBlank @Size(max = 300) String direccion,
        @NotBlank @Size(min = 4, max = 72) String password) {
}