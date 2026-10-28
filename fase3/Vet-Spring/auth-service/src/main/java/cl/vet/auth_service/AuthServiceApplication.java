package cl.vet.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"cl.vet.auth_service", "cl.vet.common"})
public class AuthServiceApplication {
	static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}
}