package cl.vet.auth_service.dto;

import cl.vet.auth_service.model.Rol;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record UsuarioRequest(
        @NotBlank @Size(max = 9) String run,
        @NotBlank @Size(max = 30) String nombre,
        @NotBlank @Size(max = 30) String apellidos,
        @NotBlank @Email @Size(max = 40) String email,
        @NotNull @Past LocalDate fechaNac,
        @NotBlank @Size(max = 40) String region,
        @NotBlank @Size(max = 30) String comuna,
        @NotBlank @Size(max = 300) String direccion,
        @NotNull Rol rol,
        @Size(min = 4, max = 10) String password) {
}