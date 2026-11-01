package cl.vet.common.dto;

import cl.vet.common.model.Rol;

public record UsuarioInternoResponse(
        Long id,
        String email,
        String passwordHash,
        Rol rol) {
}