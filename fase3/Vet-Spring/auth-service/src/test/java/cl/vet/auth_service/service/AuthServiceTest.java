package cl.vet.auth_service.service;

import cl.vet.auth_service.client.UsuarioClient;
import cl.vet.auth_service.dto.AuthResponse;
import cl.vet.auth_service.dto.LoginRequest;
import cl.vet.common.dto.UsuarioInternoResponse;
import cl.vet.common.exception.UnauthorizedException;
import cl.vet.common.model.Rol;
import cl.vet.common.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioClient usuarios;
    @Mock
    private PasswordEncoder encoder;
    @Mock
    private JwtService jwt;
    @InjectMocks
    private AuthService service;

    @Test
    void login_lanzaExcepcionSiElEmailNoExiste() {
        when(usuarios.buscarPorEmail("no-existe@correo.cl")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("no-existe@correo.cl", "123456");

        assertThrows(UnauthorizedException.class, () -> service.login(request));
    }

    @Test
    void login_lanzaExcepcionSiLaPasswordNoCoincide() {
        UsuarioInternoResponse usuario = new UsuarioInternoResponse(1L, "Juan", "juan@correo.cl", "hashGuardado", Rol.CLIENTE);
        when(usuarios.buscarPorEmail("juan@correo.cl")).thenReturn(Optional.of(usuario));
        when(encoder.matches("claveIncorrecta", "hashGuardado")).thenReturn(false);

        LoginRequest request = new LoginRequest("juan@correo.cl", "claveIncorrecta");

        assertThrows(UnauthorizedException.class, () -> service.login(request));
    }

    @Test
    void login_devuelveTokensSiLasCredencialesSonCorrectas() {
        UsuarioInternoResponse usuario = new UsuarioInternoResponse(1L, "Juan", "juan@correo.cl", "hashGuardado", Rol.CLIENTE);
        when(usuarios.buscarPorEmail("juan@correo.cl")).thenReturn(Optional.of(usuario));
        when(encoder.matches("claveCorrecta", "hashGuardado")).thenReturn(true);
        when(jwt.generarToken("juan@correo.cl", 1L, Rol.CLIENTE, "Juan")).thenReturn("token-falso");
        when(jwt.generarRefreshToken("juan@correo.cl", 1L, Rol.CLIENTE, "Juan")).thenReturn("refresh-falso");

        LoginRequest request = new LoginRequest("juan@correo.cl", "claveCorrecta");

        AuthResponse respuesta = service.login(request);

        assertThat(respuesta.token()).isEqualTo("token-falso");
        assertThat(respuesta.refreshToken()).isEqualTo("refresh-falso");
    }
}