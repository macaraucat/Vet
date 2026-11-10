package cl.vet.product_service.service;

import cl.vet.product_service.model.Categoria;
import cl.vet.product_service.model.Producto;
import cl.vet.product_service.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Producto buscarPorId(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public Producto crear(Producto producto) {
        return repository.save(producto);
    }

    public Producto actualizar(Long id, Producto datos) {
        Producto producto = buscarPorId(id);
        producto.setCodigo(datos.getCodigo());
        producto.setNombre(datos.getNombre());
        producto.setDetalle(datos.getDetalle());
        producto.setEspecie(datos.getEspecie());
        producto.setPrecio(datos.getPrecio());
        producto.setImagen(datos.getImagen());
        producto.setCategoria(datos.getCategoria());
        return repository.save(producto);
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
}