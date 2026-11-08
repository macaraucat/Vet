package cl.vet.user_service.controller;

import cl.vet.common.exception.UnauthorizedException;
import cl.vet.common.dto.UsuarioInternoRequest;
import cl.vet.common.dto.UsuarioInternoResponse;
import cl.vet.user_service.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@RestController
@RequestMapping("/api/v1/users/internal")
public class UsuarioInternoController {

    private static final String HEADER = "X-Internal-Key";

    private final UsuarioService service;
    private final String apiKey;

    public UsuarioInternoController(UsuarioService service, @Value("${internal.api-key}") String apiKey) {
        this.service = service;
        this.apiKey = apiKey;
    }

    @GetMapping("/{email}")
    public UsuarioInternoResponse porEmail(@RequestHeader(value = HEADER, required = false) String key, @PathVariable String email) {
        verificar(key);
        return service.buscarPorEmail(email);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioInternoResponse crear(@RequestHeader(value = HEADER, required = false) String key, @Valid @RequestBody UsuarioInternoRequest req) {
        verificar(key);
        return service.crearInterno(req);
    }

    private void verificar(String key) {
        boolean ok = key != null && MessageDigest.isEqual(apiKey.getBytes(StandardCharsets.UTF_8), key.getBytes(StandardCharsets.UTF_8));
        if (!ok) {
            throw new UnauthorizedException("Clave interna inválida");
        }
    }
}