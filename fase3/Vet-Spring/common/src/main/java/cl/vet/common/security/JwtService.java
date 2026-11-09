package cl.vet.common.security;

import cl.vet.common.model.Rol;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;  // ← Spring, no Lombok
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long exp;
    private final long refreshExp;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration}") long exp,
                      @Value("${jwt.refresh-expiration}") long refreshExp) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.exp = exp;
        this.refreshExp = refreshExp;
    }

    public String generarToken(String email, Long id, Rol rol, String nombre) {
        Date ahora = new Date();
        return construir(email, id, rol, nombre, "access", ahora, new Date(ahora.getTime() + exp));
    }

    public String generarRefreshToken(String email, Long id, Rol rol, String nombre) {
        Date ahora = new Date();
        return construir(email, id, rol, nombre, "refresh", ahora, new Date(ahora.getTime() + refreshExp));
    }

    private String construir(String email, Long id, Rol rol, String nombre, String tipo, Date emision, Date expiracion) {
        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("rol", rol.name())
                .claim("nombre", nombre)
                .claim("tipo", tipo)
                .issuedAt(emision)
                .expiration(expiracion)
                .signWith(key)
                .compact();
    }

    public Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean esRefreshToken(Claims claims) {
        return "refresh".equals(claims.get("tipo", String.class));
    }
}