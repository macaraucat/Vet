package cl.vet.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = "cl.vet")
@EnableFeignClients(basePackages = "cl.vet.auth_service.client")
public class AuthServiceApplication {
	static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}
}