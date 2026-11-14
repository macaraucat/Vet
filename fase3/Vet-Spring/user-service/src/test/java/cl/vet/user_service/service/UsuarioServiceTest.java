package cl.vet.user_service.service;

import cl.vet.common.exception.InvalidStateException;
import cl.vet.common.exception.ResourceNotFoundException;
import cl.vet.common.model.Rol;
import cl.vet.user_service.dto.UsuarioRequest;
import cl.vet.user_service.dto.UsuarioResponse;
import cl.vet.user_service.model.Usuario;
import cl.vet.user_service.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repo;
    @Mock
    private PasswordEncoder encoder;
    @InjectMocks
    private UsuarioService service;

    private UsuarioRequest requestBase() {
        return new UsuarioRequest(
                "12345678K", "Juan", "Pérez", "juan@gmail.com",
                LocalDate.of(1990, 1, 1), "Región Metropolitana", "Rancagua",
                "Calle 123", Rol.ADMINISTRADOR, "clave1234");
    }

    @Test
    void crear_lanzaExcepcionSiLaPasswordEstaVacia() {
        UsuarioRequest request = new UsuarioRequest(
                "12345678K", "Juan", "Pérez", "juan@gmail.com",
                LocalDate.of(1990, 1, 1), "Región Metropolitana", "Rancagua",
                "Calle 123", Rol.ADMINISTRADOR, "");

        assertThrows(cl.vet.common.exception.BadRequestException.class, () -> service.crear(request));
    }

    @Test
    void crear_lanzaExcepcionSiElCorreoYaExiste() {
        when(repo.existsByEmail("juan@gmail.com")).thenReturn(true);

        assertThrows(InvalidStateException.class, () -> service.crear(requestBase()));
    }

    @Test
    void actualizar_lanzaExcepcionSiUnAdminIntentaCambiarseSuPropioRol() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("juan@gmail.com");
        usuario.setRol(Rol.ADMINISTRADOR);

        when(repo.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioRequest request = new UsuarioRequest(
                "12345678K", "Juan", "Pérez", "juan@gmail.com",
                LocalDate.of(1990, 1, 1), "Región Metropolitana", "Rancagua",
                "Calle 123", Rol.FUNCIONARIO, null);

        assertThrows(InvalidStateException.class,
                () -> service.actualizar(1L, request, "juan@gmail.com"));
    }

    @Test
    void eliminar_lanzaExcepcionSiElUsuarioIntentaEliminarseASiMismo() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("juan@gmail.com");

        when(repo.findById(1L)).thenReturn(Optional.of(usuario));

        assertThrows(InvalidStateException.class,
                () -> service.eliminar(1L, "juan@gmail.com"));
    }

    @Test
    void obtener_lanzaExcepcionSiElUsuarioNoExiste() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.obtener(99L));
    }
}