package cl.vet.user_service.repository;

import cl.vet.user_service.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRun(String run);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByRunAndIdNot(String run, Long id);
}