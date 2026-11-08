package cl.vet.product_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ItemCarritoDTO {
    private Long productoId;
    private Integer cantidad;
}