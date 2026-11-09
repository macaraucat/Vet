package cl.vet.user_service;

import cl.vet.common.config.OpenApiConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication(scanBasePackages = "cl.vet")
@Import(OpenApiConfig.class)
public class UserServiceApplication {
	static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}
}