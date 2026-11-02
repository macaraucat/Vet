package cl.vet.user_service.service;

import cl.vet.common.dto.UsuarioInternoRequest;
import cl.vet.common.dto.UsuarioInternoResponse;
import cl.vet.user_service.dto.*;
import cl.vet.user_service.model.Usuario;
import cl.vet.user_service.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repo.findAll(Sort.by("id")).stream().map(UsuarioResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.desde(buscar(id));
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest r) {
        if (r.password() == null || r.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria.");
        }
        String run = normalizarRun(r.run());
        String email = normalizarEmail(r.email());
        validarUnicos(run, email, null);

        Usuario u = new Usuario();
        aplicar(u, r, run, email);
        u.setPasswordHash(encoder.encode(r.password()));
        return UsuarioResponse.desde(repo.save(u));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest r) {
        Usuario u = buscar(id);
        String run = normalizarRun(r.run());
        String email = normalizarEmail(r.email());
        validarUnicos(run, email, id);

        aplicar(u, r, run, email);
        if (r.password() != null && !r.password().isBlank()) {
            u.setPasswordHash(encoder.encode(r.password()));
        }
        return UsuarioResponse.desde(repo.save(u));
    }

    @Transactional
    public void eliminar(Long id) {
        repo.delete(buscar(id));
    }

    // Uso interno (auth-service)
    @Transactional(readOnly = true)
    public UsuarioInternoResponse buscarPorEmail(String email) {
        return repo.findByEmail(normalizarEmail(email))
                .map(this::aRespuestaInterna)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    @Transactional
    public UsuarioInternoResponse crearInterno(UsuarioInternoRequest r) {
        String run = normalizarRun(r.run());
        String email = normalizarEmail(r.email());
        validarUnicos(run, email, null);

        Usuario u = new Usuario();
        u.setRun(run);
        u.setNombre(r.nombre().trim());
        u.setApellidos(r.apellidos().trim());
        u.setEmail(email);
        u.setFechaNac(r.fechaNac());
        u.setRegion(r.region());
        u.setComuna(r.comuna().trim());
        u.setDireccion(r.direccion().trim());
        u.setPasswordHash(r.passwordHash());
        u.setRol(r.rol());
        return aRespuestaInterna(repo.save(u));
    }

    private UsuarioInternoResponse aRespuestaInterna(Usuario u) {
        return new UsuarioInternoResponse(
                u.getId(),
                u.getNombre(),
                u.getEmail(),
                u.getPasswordHash(),
                u.getRol());
    }

    // helpers
    private Usuario buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private void aplicar(Usuario u, UsuarioRequest r, String run, String email) {
        u.setRun(run);
        u.setNombre(r.nombre().trim());
        u.setApellidos(r.apellidos().trim());
        u.setEmail(email);
        u.setFechaNac(r.fechaNac());
        u.setRegion(r.region());
        u.setComuna(r.comuna().trim());
        u.setDireccion(r.direccion().trim());
        u.setRol(r.rol());
    }

    private void validarUnicos(String run, String email, Long idActual) {
        boolean emailEnUso = idActual == null ? repo.existsByEmail(email) : repo.existsByEmailAndIdNot(email, idActual);
        if (emailEnUso) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo electrónico.");
        }
        boolean runEnUso = idActual == null ? repo.existsByRun(run) : repo.existsByRunAndIdNot(run, idActual);
        if (runEnUso) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese RUN.");
        }
    }

    private String normalizarRun(String run) {
        return run.trim().toUpperCase();
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }
}