package cl.vet.auth_service.dto;

import cl.vet.common.dto.UsuarioInternoRequest;
import cl.vet.common.model.Rol;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegistroRequest(
        @Pattern(regexp = "^[0-9]{7,8}[0-9kK]$", message = "RUN inválido.") @NotBlank @Size(max = 9) String run,
        @NotBlank @Size(max = 30) String nombre,
        @NotBlank @Size(max = 30) String apellidos,
        @Pattern(regexp = "(?i)^.+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$") @NotBlank @Email @Size(max = 40) String email,
        @NotNull @Past LocalDate fechaNac,
        @NotBlank @Size(max = 40) String region,
        @NotBlank @Size(max = 30) String comuna,
        @NotBlank @Size(max = 100) String direccion,
        @NotBlank @Size(min = 4, max = 72) String password) {

    public UsuarioInternoRequest aUsuarioInterno(String passwordHash) {
        return new UsuarioInternoRequest(run, nombre, apellidos, email, fechaNac, region, comuna, direccion, passwordHash, Rol.CLIENTE);
    }
}