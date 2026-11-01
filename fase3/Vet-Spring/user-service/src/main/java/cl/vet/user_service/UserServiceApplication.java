package cl.vet.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "cl.vet")
public class UserServiceApplication {

	static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

}