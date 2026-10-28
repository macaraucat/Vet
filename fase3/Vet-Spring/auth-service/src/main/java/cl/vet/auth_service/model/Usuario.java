package cl.vet.auth_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter @Setter @NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 9)
    private String run;

    @Column(nullable = false, length = 30)
    private String nombre;

    @Column(nullable = false, length = 30)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 40)
    private String email;

    @Column(nullable = false, length = 60)
    private String password;

    private LocalDate fechaNac;

    @Column(length = 40)
    private String region;

    @Column(length = 30)
    private String comuna;

    @Column(length = 300)
    private String direccion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    private boolean activo = true;
}
