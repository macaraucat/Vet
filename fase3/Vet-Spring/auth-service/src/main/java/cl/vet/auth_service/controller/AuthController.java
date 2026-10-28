package cl.vet.auth_service.controller;

import cl.vet.auth_service.dto.AuthResponse;
import cl.vet.auth_service.dto.LoginRequest;
import cl.vet.auth_service.dto.RegistroRequest;
import cl.vet.auth_service.dto.UsuarioResponse;
import cl.vet.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req){
        return service.login(req);
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registro(@Valid @RequestBody RegistroRequest req){
        return service.registrar(req);
    }

    @GetMapping("/usuarios")
    public List<UsuarioResponse> listarUsuarios(){
        return service.listarUsuarios();
    }

}