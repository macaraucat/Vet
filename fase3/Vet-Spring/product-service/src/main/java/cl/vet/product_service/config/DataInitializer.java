package cl.vet.product_service.config;

import cl.vet.product_service.model.Categoria;
import cl.vet.product_service.model.Producto;
import cl.vet.product_service.repository.CategoriaRepository;
import cl.vet.product_service.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final CategoriaRepository categoriaRepo;
    private final ProductoRepository productoRepo;

    @EventListener(ApplicationReadyEvent.class)
    public void sembrar() {
        Map<String, Categoria> cat = sembrarCategorias();
        sembrarProductos(cat);
    }

    private Map<String, Categoria> sembrarCategorias() {
        Map<String, Categoria> map = new HashMap<>();
        for (String n : List.of("Antibióticos", "Antiparasitarios", "Antiinflamatorios",
                "Dermatología", "Digestivo", "Cardíaco",
                "Analgésicos", "Vacunas", "Suplementos")) {
            Categoria c = categoriaRepo.findByNombre(n)
                    .orElseGet(() -> categoriaRepo.save(new Categoria(n)));
            map.put(n, c);
        }
        return map;
    }

    private void sembrarProductos(Map<String, Categoria> cat) {
        if (productoRepo.count() > 0) return;

        productoRepo.saveAll(List.of(
                p("ME001", "Amoxibay 250mg", "Amoxicilina · Blíster 10 comp.", "Perro / Gato", 4200, "/img/ME001.jpeg", cat.get("Antibióticos")),
                p("ME002", "Enrox 50mg", "Enrofloxacino · Blíster 10 comp.", "Perro / Gato", 6800, "/img/ME002.jpeg", cat.get("Antibióticos")),
                p("ME003", "Metrobay 250mg", "Metronidazol · Blíster 10 comp.", "Perro / Gato", 3900, "/img/ME003.jpeg", cat.get("Antibióticos")),
                p("ME004", "Nexgard", "Afoxolaner · Masticable 1 unid.", "Perro", 9500, "/img/ME004.jpeg", cat.get("Antiparasitarios")),
                p("ME005", "Bravecto", "Fluralaner · Masticable 1 unid.", "Perro", 18900, "/img/ME005.jpeg", cat.get("Antiparasitarios")),
                p("ME006", "Revolution Plus", "Selamectina + Sarolaner · Pipeta 1 unid.", "Gato", 14500, "/img/ME006.jpeg", cat.get("Antiparasitarios")),
                p("ME007", "Drontal Plus", "Praziquantel + Pamoato · Comprimido 1 unid.", "Perro", 3200, "/img/ME007.jpeg", cat.get("Antiparasitarios")),
                p("ME008", "Milbemax Gato", "Milbemicina + Praziquantel · Comprimido 2 unid.", "Gato", 6800, "/img/ME008.jpeg", cat.get("Antiparasitarios")),
                p("ME009", "Meloxicam 1mg", "Meloxicam · Blíster 10 comp.", "Perro / Gato", 4500, "/img/ME009.jpeg", cat.get("Antiinflamatorios")),
                p("ME010", "Carprofen 50mg", "Carprofeno · Blíster 10 comp.", "Perro", 9800, "/img/ME010.jpeg", cat.get("Antiinflamatorios")),
                p("ME011", "Clorhexidina shampoo", "Clorhexidina 2% · Frasco 250ml", "Perro / Gato", 8900, "/img/ME011.jpeg", cat.get("Dermatología")),
                p("ME012", "Malaseb shampoo", "Miconazol + Clorhexidina · Frasco 250ml", "Perro / Gato", 12500, "/img/ME012.jpeg", cat.get("Dermatología")),
                p("ME013", "Apoquel 16mg", "Oclacitinib · Blíster 10 comp.", "Perro", 22000, "/img/ME013.jpeg", cat.get("Dermatología")),
                p("ME014", "Probifor", "Bacillus clausii · Sobre 5ml x10", "Perro / Gato", 5600, "/img/ME014.jpeg", cat.get("Digestivo")),
                p("ME015", "Omeprazol 10mg vet", "Omeprazol · Blíster 10 comp.", "Perro / Gato", 3800, "/img/ME015.jpeg", cat.get("Digestivo")),
                p("ME016", "Vetmedin 2.5mg", "Pimobendan · Blíster 10 comp.", "Perro", 28000, "/img/ME016.jpeg", cat.get("Cardíaco")),
                p("ME017", "Tramadol 50mg vet", "Tramadol · Blíster 10 comp.", "Perro", 5200, "/img/ME017.png",  cat.get("Analgésicos")),
                p("ME018", "Nobivac DHPPi", "Vacuna polivalente · Vial 1 dosis", "Perro", 8500, "/img/ME018.jpeg", cat.get("Vacunas")),
                p("ME019", "Nobivac Rabies", "Vacuna antirrábica · Vial 1 dosis", "Perro / Gato", 5800, "/img/ME019.jpeg", cat.get("Vacunas")),
                p("ME020", "Felocell CVR", "Vacuna triple felina · Vial 1 dosis", "Gato", 7200, "/img/ME020.jpeg", cat.get("Vacunas")),
                p("ME021", "Omega vet 3-6-9", "Ácidos grasos omega · Frasco 100ml", "Perro / Gato", 9900, "/img/ME021.jpeg", cat.get("Suplementos")),
                p("ME022", "Condrovet forte", "Condroitín + Glucosamina · Blíster 30 comp.", "Perro", 14500, "/img/ME022.jpeg", cat.get("Suplementos"))
        ));
    }

    private Producto p(String cod, String nom, String det, String esp,
                       int precio, String img, Categoria categoria) {
        Producto x = new Producto();
        x.setCodigo(cod);
        x.setNombre(nom);
        x.setDetalle(det);
        x.setEspecie(esp);
        x.setPrecio(precio);
        x.setImagen(img);
        x.setCategoria(categoria);
        return x;
    }
}