package cl.vet.auth_service.config;

import cl.vet.common.exception.BadRequestException;
import cl.vet.common.exception.InvalidStateException;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class UserFeignConfig {

    @Bean
    RequestInterceptor internalKeyInterceptor(@Value("${internal.api-key}") String internalKey) {
        return template -> template.header("X-Internal-Key", internalKey);
    }

    @Bean
    ErrorDecoder userServiceErrorDecoder() {
        ErrorDecoder porDefecto = new ErrorDecoder.Default();
        return (methodKey, response) -> switch (response.status()) {
            case 400 -> new BadRequestException("Los datos enviados al servicio de usuarios no son válidos.");
            case 409 -> new InvalidStateException("El correo o el RUN ya están registrados.");
            default -> porDefecto.decode(methodKey, response);
        };
    }
}