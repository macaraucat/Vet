package cl.vet.auth_service.dto;

import cl.vet.auth_service.model.Rol;
import java.time.LocalDate;

public record UsuarioClientRequest(
        String run,
        String nombre,
        String apellidos,
        String email,
        LocalDate fechaNac,
        String region,
        String comuna,
        String direccion,
        String passwordHash,
        Rol rol) {

    public static UsuarioClientRequest desde(RegistroRequest r, String passwordHash) {
        return new UsuarioClientRequest(r.run(), r.nombre(), r.apellidos(), r.email(), r.fechaNac(),
                r.region(), r.comuna(), r.direccion(), passwordHash, Rol.CLIENTE);
    }
}