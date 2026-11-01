package cl.vet.user_service.model;

import cl.vet.common.model.Rol;
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

    @Column(nullable = false)
    private LocalDate fechaNac;

    @Column(nullable = false, length = 40)
    private String region;

    @Column(nullable = false, length = 30)
    private String comuna;

    @Column(nullable = false, length = 300)
    private String direccion;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;
}