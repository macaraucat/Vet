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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoletaService {

    private final BoletaRepository boletaRepository;
    private final DetalleBoletaRepository detalleBoletaRepository;
    private final ProductoRepository productoRepository;

    public Boleta crear(BoletaRequestDTO request) {
        int total = 0;

        Boleta boleta = new Boleta();
        boleta.setUsuarioId(request.getUsuarioId());
        boleta.setFecha(LocalDateTime.now());
        boleta.setTotal(0);
        boleta = boletaRepository.save(boleta);

        for (ItemCarritoDTO item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado: " + item.getProductoId()));

            DetalleBoleta detalle = new DetalleBoleta();
            detalle.setBoleta(boleta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalleBoletaRepository.save(detalle);

            total += producto.getPrecio() * item.getCantidad();
        }

        boleta.setTotal(total);
        return boletaRepository.save(boleta);
    }

    public List<Boleta> listar() {
        return boletaRepository.findAll();
    }

    public Boleta buscarPorId(Long id) {
        return boletaRepository.findById(id).orElseThrow();
    }

    public List<DetalleBoleta> detalleDe(Long boletaId) {
        return detalleBoletaRepository.findByBoletaId(boletaId);
    }
}