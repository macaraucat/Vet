package cl.vet.product_service.controller;

import cl.vet.product_service.dto.BoletaRequestDTO;
import cl.vet.product_service.model.Boleta;
import cl.vet.product_service.model.DetalleBoleta;
import cl.vet.product_service.service.BoletaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boletas")
@RequiredArgsConstructor
public class BoletaController {

    private final BoletaService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Boleta crear(@RequestBody BoletaRequestDTO request) {
        return service.crear(request);
    }

    @GetMapping
    public List<Boleta> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Boleta buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/{id}/detalle")
    public List<DetalleBoleta> detalle(@PathVariable Long id) {
        return service.detalleDe(id);
    }
}