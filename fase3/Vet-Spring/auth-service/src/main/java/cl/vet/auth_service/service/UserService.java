package cl.vet.auth_service.service;

import cl.vet.auth_service.dto.UsuarioResponse;
import cl.vet.auth_service.dto.UsuarioRequest;
import cl.vet.auth_service.exception.InvalidStateException;
import cl.vet.auth_service.exception.ResourceNotFoundException;
import cl.vet.auth_service.model.Usuario;
import cl.vet.auth_service.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public List<UsuarioResponse> listarUsuarios() {
        return repo.findAll().stream().map(UsuarioResponse::from).toList();
    }

    public UsuarioResponse crearUsuario(UsuarioRequest req) {
        if (repo.existsByRun(req.run()))
            throw new InvalidStateException("Este RUN ya está registrado.");
        if (repo.existsByEmailIgnoreCase(req.email()))
            throw new InvalidStateException("Este correo electrónico ya está registrado.");
        if (req.password() == null || req.password().isBlank())
            throw new InvalidStateException("Debe asignar una contraseña al usuario.");

        Usuario u = new Usuario();
        u.setRun(req.run().trim().toUpperCase());
        u.setNombre(req.nombre().trim());
        u.setApellidos(req.apellidos().trim());
        u.setEmail(req.email().trim().toLowerCase());
        u.setFechaNac(req.fechaNac());
        u.setRegion(req.region().trim());
        u.setComuna(req.comuna().trim());
        u.setDireccion(req.direccion().trim());
        u.setPassword(encoder.encode(req.password()));
        u.setRol(req.rol());
        return UsuarioResponse.from(repo.save(u));
    }

    public UsuarioResponse actualizarUsuario(Long id, UsuarioRequest req) {
        Usuario u = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (repo.existsByRunAndIdNot(req.run(), id))
            throw new InvalidStateException("Este RUN ya está registrado.");
        if (repo.existsByEmailIgnoreCaseAndIdNot(req.email(), id))
            throw new InvalidStateException("Este correo electrónico ya está registrado.");

        u.setRun(req.run().trim().toUpperCase());
        u.setNombre(req.nombre().trim());
        u.setApellidos(req.apellidos().trim());
        u.setEmail(req.email().trim().toLowerCase());
        u.setFechaNac(req.fechaNac());
        u.setRegion(req.region().trim());
        u.setComuna(req.comuna().trim());
        u.setDireccion(req.direccion().trim());
        u.setRol(req.rol());
        if (req.password() != null && !req.password().isBlank()) {
            u.setPassword(encoder.encode(req.password()));
        }
        return UsuarioResponse.from(repo.save(u));
    }

    public void eliminarUsuario(Long id) {
        if (!repo.existsById(id))
            throw new ResourceNotFoundException("Usuario no encontrado.");
        repo.deleteById(id);
    }
}