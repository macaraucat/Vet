package cl.vet.user_service.dto;

import cl.vet.common.model.Rol;
import cl.vet.user_service.model.Usuario;

import java.time.LocalDate;

public record UsuarioResponse(
        Long id,
        String run,
        String nombre,
        String apellidos,
        String email,
        LocalDate fechaNac,
        String region,
        String comuna,
        String direccion,
        Rol rol) {

    public static UsuarioResponse desde(Usuario u) {
        return new UsuarioResponse(
                u.getId(),
                u.getRun(),
                u.getNombre(),
                u.getApellidos(),
                u.getEmail(),
                u.getFechaNac(),
                u.getRegion(),
                u.getComuna(),
                u.getDireccion(),
                u.getRol());
    }
}