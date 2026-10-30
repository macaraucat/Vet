package cl.vet.auth_service.service;

import cl.vet.auth_service.client.UsuarioClient;
import cl.vet.auth_service.dto.*;
import cl.vet.common.exception.UnauthorizedException;
import cl.vet.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String TIPO_TOKEN = "Bearer";

    private final UsuarioClient usuario;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthResponse login(LoginRequest request) {
        UsuarioClientDTO u = usuario.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!encoder.matches(request.password(), u.passwordHash())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        return emitirToken(u);
    }

    public AuthResponse registrar(RegistroRequest req) {
        UsuarioClientRequest nuevo = UsuarioClientRequest.desde(req, encoder.encode(req.password()));
        UsuarioClientDTO creado = usuario.crear(nuevo);
        return emitirToken(creado);
    }

    private AuthResponse emitirToken(UsuarioClientDTO u) {
        String token = jwt.generarToken(u.email(), u.id(), u.rol().name());
        return new AuthResponse(token, TIPO_TOKEN);
    }
}