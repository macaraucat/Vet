package cl.vet.auth_service.dto;

import cl.vet.auth_service.model.Rol;

public record UsuarioClientDTO(
        Long id,
        String email,
        String passwordHash,
        Rol rol  ) {
}