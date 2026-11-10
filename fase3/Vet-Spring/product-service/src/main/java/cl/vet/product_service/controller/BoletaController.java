package cl.vet.product_service.controller;

import cl.vet.product_service.dto.BoletaRequestDTO;
import cl.vet.product_service.model.Boleta;
import cl.vet.product_service.model.DetalleBoleta;
import cl.vet.product_service.service.BoletaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boletas")
@RequiredArgsConstructor
public class BoletaController {

    private final BoletaService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Boleta crear(@RequestBody BoletaRequestDTO request) {
        return service.crear(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<Boleta> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Boleta buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/{id}/detalle")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<DetalleBoleta> detalle(@PathVariable Long id) {
        return service.detalleDe(id);
    }
}