package cl.vet.auth_service.service;

import cl.vet.auth_service.client.UsuarioClient;
import cl.vet.auth_service.dto.AuthResponse;
import cl.vet.auth_service.dto.LoginRequest;
import cl.vet.auth_service.dto.RegistroRequest;
import cl.vet.common.dto.UsuarioInternoResponse;
import cl.vet.common.exception.UnauthorizedException;
import cl.vet.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final String TIPO_TOKEN = "Bearer";
    private final UsuarioClient usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthResponse login(LoginRequest login) {
        UsuarioInternoResponse u = usuarios.buscarPorEmail(login.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!encoder.matches(login.password(), u.passwordHash())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        return emitirToken(u);
    }

    public AuthResponse registrar(RegistroRequest registro) {
        UsuarioInternoResponse creado = usuarios.crear(registro.aUsuarioInterno(encoder.encode(registro.password())));
        return emitirToken(creado);
    }

    private AuthResponse emitirToken(UsuarioInternoResponse u) {
        String token = jwt.generarToken(u.email(), u.id(), u.rol(), u.nombre());
        return new AuthResponse(token, TIPO_TOKEN);
    }
}