package cl.vet.product_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class BoletaRequestDTO {
    private Long usuarioId;
    private List<ItemCarritoDTO> items;
}