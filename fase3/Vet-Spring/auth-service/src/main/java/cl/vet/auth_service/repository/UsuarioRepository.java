package cl.vet.auth_service.repository;

import cl.vet.auth_service.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByRun(String run);
    boolean existsByRunAndIdNot(String run, Long id);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}
