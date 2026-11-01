package cl.vet.auth_service.client;

import cl.vet.auth_service.config.UserFeignConfig;
import cl.vet.common.dto.UsuarioInternoRequest;
import cl.vet.common.dto.UsuarioInternoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@FeignClient(
        name = "user-service",
        url = "${user.service.url}",
        configuration = UserFeignConfig.class,
        dismiss404 = true)
public interface UsuarioClient {

    @GetMapping("/api/usuarios/internal/email/{email}")
    Optional<UsuarioInternoResponse> buscarPorEmail(@PathVariable("email") String email);

    @PostMapping("/api/usuarios/internal")
    UsuarioInternoResponse crear(@RequestBody UsuarioInternoRequest request);
}