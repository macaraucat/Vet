package cl.vet.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "cl.vet")
public class AuthServiceApplication {
	static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}
}