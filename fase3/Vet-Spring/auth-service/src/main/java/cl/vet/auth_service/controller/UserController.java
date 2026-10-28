package cl.vet.auth_service.controller;

import cl.vet.auth_service.dto.UsuarioRequest;
import cl.vet.auth_service.dto.UsuarioResponse;
import cl.vet.auth_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/usuarios")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listarUsuarios();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody UsuarioRequest req) {
        return service.crearUsuario(req);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest req) {
        return service.actualizarUsuario(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminarUsuario(id);
    }
}