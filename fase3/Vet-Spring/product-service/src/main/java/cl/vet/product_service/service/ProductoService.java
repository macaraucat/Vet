package cl.vet.product_service.service;

import cl.vet.common.exception.BadRequestException;
import cl.vet.common.exception.ResourceNotFoundException;
import cl.vet.product_service.model.Categoria;
import cl.vet.product_service.model.Producto;
import cl.vet.product_service.repository.CategoriaRepository;
import cl.vet.product_service.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository repository;
    private final CategoriaRepository categoriaRepository;

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Producto buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    public Producto crear(Producto producto) {
        producto.setCategoria(resolverCategoria(producto));
        return repository.save(producto);
    }

    public Producto actualizar(Long id, Producto datos) {
        Producto p = buscarPorId(id);
        p.setCodigo(datos.getCodigo());
        p.setNombre(datos.getNombre());
        p.setDetalle(datos.getDetalle());
        p.setEspecie(datos.getEspecie());
        p.setPrecio(datos.getPrecio());
        p.setImagen(datos.getImagen());
        p.setCategoria(resolverCategoria(datos));
        return repository.save(p);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public List<Producto> buscarPorCategoria(Categoria categoria) {
        return repository.findByCategoria(categoria);
    }

    public List<Producto> buscarPorNombre(String nombre) {
        return repository.findByNombreContainingIgnoreCase(nombre);
    }

    private Categoria resolverCategoria(Producto datos) {
        Long catId = datos.getCategoria() != null ? datos.getCategoria().getId() : null;
        if (catId == null) {
            throw new BadRequestException("La categoría es obligatoria.");
        }
        return categoriaRepository.findById(catId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + catId));
    }
}