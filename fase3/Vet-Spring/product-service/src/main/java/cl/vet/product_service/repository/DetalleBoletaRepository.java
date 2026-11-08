package cl.vet.product_service.repository;

import cl.vet.product_service.model.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleBoletaRepository extends JpaRepository<DetalleBoleta, Long> {
    List<DetalleBoleta> findByBoletaId(Long boletaId);
}