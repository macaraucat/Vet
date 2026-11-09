package cl.vet.auth_service.service;

import cl.vet.auth_service.client.UsuarioClient;
import cl.vet.auth_service.dto.*;
import cl.vet.common.dto.UsuarioInternoResponse;
import cl.vet.common.exception.UnauthorizedException;
import cl.vet.common.model.Rol;
import cl.vet.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final String TIPO_TOKEN = "Bearer";
    private final UsuarioClient usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthResponse login(LoginRequest login){
        UsuarioInternoResponse u = usuarios.buscarPorEmail(login.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!encoder.matches(login.password(), u.passwordHash())){
            throw new UnauthorizedException("Credenciales inválidas");
        }
        return emitirTokens(u.email(), u.id(), u.rol(), u.nombre());
    }

    public AuthResponse registrar(RegistroRequest registro){
        UsuarioInternoResponse creado = usuarios.crear(registro.aUsuarioInterno(encoder.encode(registro.password())));
        return emitirTokens(creado.email(), creado.id(), creado.rol(), creado.nombre());
    }

    public AuthResponse refrescar(String refreshToken){
        Claims claims;
        try{
            claims = jwt.extraerClaims(refreshToken);
        }catch (JwtException | IllegalArgumentException e){
            throw new UnauthorizedException("Sesión expirada. Inicia sesión nuevamente.");
        }

        if (!jwt.esRefreshToken(claims)){
            throw new UnauthorizedException("Token de renovación inválido.");
        }

        Long id = ((Number) claims.get("id")).longValue();
        Rol rol = Rol.valueOf(claims.get("rol", String.class));
        return emitirTokens(claims.getSubject(), id, rol, claims.get("nombre", String.class));
    }

    private AuthResponse emitirTokens(String email, Long id, Rol rol, String nombre) {
        return new AuthResponse(
                jwt.generarToken(email, id, rol, nombre),
                jwt.generarRefreshToken(email, id, rol, nombre),
                TIPO_TOKEN);
    }
}