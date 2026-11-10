package cl.vet.user_service.config;

import cl.vet.common.model.Rol;
import cl.vet.user_service.model.Usuario;
import cl.vet.user_service.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    @EventListener(ApplicationReadyEvent.class)
    public void sembrarUsuarios() {
        if (repo.count() > 0) return;

        repo.save(crear("92243842", "Admin", "Sistema", "admin@gmail.com", "admin123",
                LocalDate.of(1972, 5, 6), "Rancagua", "Av. Italia 1450", Rol.ADMINISTRADOR));

        repo.save(crear("16080078K", "Funcionario", "Sistema", "func@gmail.com", "func123",
                LocalDate.of(1984, 11, 6), "San Fernando", "Av. España 1570", Rol.FUNCIONARIO));

        repo.save(crear("91234562", "Laura", "Claro Hernández", "laura.claro@gmail.com", "laura123",
                LocalDate.of(1981, 6, 23), "San Fernando", "Calle Errázuriz 320", Rol.FUNCIONARIO));

        repo.save(crear("102345673", "Carmen", "Martínez Larraín", "carmen.martinez@gmail.com", "carmen123",
                LocalDate.of(1982, 9, 8), "Rengo", "Av. Miguel Carrera 855", Rol.FUNCIONARIO));

        repo.save(crear("113456788", "Ignacio", "Solar Guzmán", "ignacio.solar@gmail.com", "ignacio123",
                LocalDate.of(1983, 1, 30), "Rancagua", "Paseo Estado 67", Rol.FUNCIONARIO));

        repo.save(crear("124567892", "Jorge", "Vial Peña", "jorge.vial@gmail.com", "jorge123",
                LocalDate.of(1984, 11, 17), "Santa Cruz", "Calle Manuel Rodríguez 490", Rol.FUNCIONARIO));

        repo.save(crear("135678906", "Sofía", "Astorga Zapata", "sofia.astorga@gmail.com", "sofia123",
                LocalDate.of(1985, 4, 5), "Machalí", "Camino a Sierra Nevada 1025", Rol.FUNCIONARIO));
    }

    private Usuario crear(String run, String nombre, String apellidos, String email, String pass,
                          LocalDate fechaNac, String comuna, String direccion, Rol rol) {
        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre(nombre);
        u.setApellidos(apellidos);
        u.setEmail(email);
        u.setFechaNac(fechaNac);
        u.setRegion("Libertador General Bernardo O'Higgins");
        u.setComuna(comuna);
        u.setDireccion(direccion);
        u.setPasswordHash(encoder.encode(pass));
        u.setRol(rol);
        return u;
    }
}