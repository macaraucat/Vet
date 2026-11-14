package cl.vet.product_service.service;

import cl.vet.common.exception.ResourceNotFoundException;
import cl.vet.product_service.dto.BoletaRequestDTO;
import cl.vet.product_service.dto.ItemCarritoDTO;
import cl.vet.product_service.model.Boleta;
import cl.vet.product_service.model.DetalleBoleta;
import cl.vet.product_service.model.Producto;
import cl.vet.product_service.repository.BoletaRepository;
import cl.vet.product_service.repository.DetalleBoletaRepository;
import cl.vet.product_service.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoletaServiceTest {

    @Mock
    private BoletaRepository boletaRepository;
    @Mock
    private DetalleBoletaRepository detalleBoletaRepository;
    @Mock
    private ProductoRepository productoRepository;
    @InjectMocks
    private BoletaService service;

    @Test
    void crear_calculaElTotalSegunPrecioYCantidad() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setPrecio(10000);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(boletaRepository.save(any(Boleta.class))).thenAnswer(inv -> inv.getArgument(0));

        BoletaRequestDTO request = new BoletaRequestDTO();
        request.setUsuarioId(1L);
        ItemCarritoDTO item = new ItemCarritoDTO();
        item.setProductoId(1L);
        item.setCantidad(3);
        request.setItems(List.of(item));

        Boleta boleta = service.crear(request);

        assertThat(boleta.getTotal()).isEqualTo(30000);
    }

    @Test
    void crear_lanzaExcepcionSiProductoNoExiste() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());
        when(boletaRepository.save(any(Boleta.class))).thenAnswer(inv -> inv.getArgument(0));

        BoletaRequestDTO request = new BoletaRequestDTO();
        request.setUsuarioId(1L);
        ItemCarritoDTO item = new ItemCarritoDTO();
        item.setProductoId(99L);
        item.setCantidad(1);
        request.setItems(List.of(item));

        assertThrows(ResourceNotFoundException.class, () -> service.crear(request));
    }

    @Test
    void crear_congelaElPrecioUnitarioAlMomentoDeLaCompra() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setPrecio(5000);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(boletaRepository.save(any(Boleta.class))).thenAnswer(inv -> inv.getArgument(0));

        BoletaRequestDTO request = new BoletaRequestDTO();
        request.setUsuarioId(1L);
        ItemCarritoDTO item = new ItemCarritoDTO();
        item.setProductoId(1L);
        item.setCantidad(1);
        request.setItems(List.of(item));

        service.crear(request);

        ArgumentCaptor<DetalleBoleta> captor = ArgumentCaptor.forClass(DetalleBoleta.class);
        verify(detalleBoletaRepository).save(captor.capture());

        assertThat(captor.getValue().getPrecioUnitario()).isEqualTo(5000);
    }
}