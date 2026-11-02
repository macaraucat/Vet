package cl.vet.user_service.dto;

import cl.vet.common.model.Rol;
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
        @NotBlank @Size(max = 100) String direccion,
        @NotNull Rol rol,
        @Pattern(regexp = "^(.{4,72})?$", message = "La contraseña debe tener entre 4 y 72 caracteres.")
        String password) {
}