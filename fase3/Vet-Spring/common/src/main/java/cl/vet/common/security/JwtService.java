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

    public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long exp) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.exp = exp;
    }

    public String generarToken(String email, Long id, Rol rol, String nombre) {
        Date ahora = new Date();
        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("rol", rol.name())
                .claim("nombre", nombre)
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + exp))
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
}