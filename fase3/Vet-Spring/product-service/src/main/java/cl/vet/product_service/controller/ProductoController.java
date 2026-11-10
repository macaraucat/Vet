package cl.vet.product_service.controller;

import cl.vet.product_service.model.Categoria;
import cl.vet.product_service.model.Producto;
import cl.vet.product_service.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    public List<Producto> listar(
            @RequestParam(required = false) Categoria categoria,
            @RequestParam(required = false) String nombre) {
        if (categoria != null) {
            return service.buscarPorCategoria(categoria);
        }
        if (nombre != null) {
            return service.buscarPorNombre(nombre);
        }
        return service.listar();
    }

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Producto crear(@RequestBody Producto producto) {
        return service.crear(producto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto datos) {
        return service.actualizar(id, datos);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}