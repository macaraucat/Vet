package cl.vet.auth_service.service;

import cl.vet.auth_service.dto.AuthResponse;
import cl.vet.auth_service.dto.LoginRequest;
import cl.vet.auth_service.dto.RegistroRequest;
import cl.vet.auth_service.dto.UsuarioResponse;
import cl.vet.auth_service.exception.InvalidStateException;
import cl.vet.auth_service.exception.UnauthorizedException;
import cl.vet.auth_service.model.Rol;
import cl.vet.auth_service.model.Usuario;
import cl.vet.auth_service.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthResponse login(LoginRequest req){
        Usuario u = repo.findByEmailIgnoreCase(req.email().trim())
                .filter(x -> x.isActivo() && encoder.matches(req.password(), x.getPassword()))
                .orElseThrow(() -> new UnauthorizedException("Correo o contraseña incorrectos."));
        return new AuthResponse(jwt.generarToken(u), "Bearer", UsuarioResponse.from(u));
    }

    public UsuarioResponse registrar(RegistroRequest req){
        if (repo.existsByEmailIgnoreCase(req.email()))
            throw new InvalidStateException("Este correo electrónico ya está registrado.");
        if (repo.existsByRun(req.run()))
            throw new InvalidStateException("Este RUN ya está registrado.");

        Usuario u = new Usuario();
        u.setRun(req.run().toUpperCase());
        u.setNombre(req.nombre().trim());
        u.setApellidos(req.apellidos().trim());
        u.setEmail(req.email().trim().toLowerCase());
        u.setFechaNac(req.fechaNac());
        u.setRegion(req.region());
        u.setComuna(req.comuna());
        u.setDireccion(req.direccion().trim());
        u.setPassword(encoder.encode(req.password()));
        u.setRol(Rol.CLIENTE);
        return UsuarioResponse.from(repo.save(u));
    }

    public List<UsuarioResponse> listarUsuarios(){
        return repo.findAll().stream().map(UsuarioResponse::from).toList();
    }

}