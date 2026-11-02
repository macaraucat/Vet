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
        repo.save(crear("11111111K", "Admin", "admin@gmail.com", "admin123", Rol.ADMINISTRADOR));
        repo.save(crear("22222222K", "Funcionario", "func@gmail.com", "func123", Rol.FUNCIONARIO));
    }

    private Usuario crear(String run, String nombre, String email, String pass, Rol rol) {
        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre(nombre);
        u.setApellidos("Sistema");
        u.setEmail(email);
        u.setFechaNac(LocalDate.of(1990, 1, 1));
        u.setRegion("Libertador General Bernardo O'Higgins");
        u.setComuna("Rancagua");
        u.setDireccion("Sin dirección");
        u.setPasswordHash(encoder.encode(pass));
        u.setRol(rol);
        return u;
    }
}