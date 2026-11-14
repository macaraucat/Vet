package cl.vet.product_service.service;

import cl.vet.common.exception.ResourceNotFoundException;
import cl.vet.product_service.model.Categoria;
import cl.vet.product_service.model.Producto;
import cl.vet.product_service.repository.CategoriaRepository;
import cl.vet.product_service.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository repository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @InjectMocks
    private ProductoService service;

    @Test
    void crear_lanzaExcepcionSiCategoriaNoExiste() {
        Categoria categoriaInexistente = new Categoria();
        categoriaInexistente.setId(99L);

        Producto producto = new Producto();
        producto.setCategoria(categoriaInexistente);

        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.crear(producto));
    }

    @Test
    void buscarPorId_lanzaExcepcionSiProductoNoExiste() {
        when(repository.findById(5L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.buscarPorId(5L));
    }

    @Test
    void buscarPorId_devuelveElProductoSiExiste() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Pelota");

        when(repository.findById(1L)).thenReturn(Optional.of(producto));

        Producto resultado = service.buscarPorId(1L);

        assertThat(resultado.getNombre()).isEqualTo("Pelota");
    }
}