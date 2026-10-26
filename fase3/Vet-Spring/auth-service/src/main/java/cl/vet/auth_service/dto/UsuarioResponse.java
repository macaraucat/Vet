package cl.vet.auth_service.dto;

import cl.vet.auth_service.model.Rol;
import cl.vet.auth_service.model.Usuario;

public record UsuarioResponse(
        Long id,
        String run,
        String nombre,
        String apellidos,
        String email,
        String region,
        String comuna,
        String direccion,
        Rol rol) {

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(
                u.getId(),
                u.getRun(),
                u.getNombre(),
                u.getApellidos(),
                u.getEmail(),
                u.getRegion(),
                u.getComuna(),
                u.getDireccion(),
                u.getRol()
        );
    }
}