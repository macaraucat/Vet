package cl.vet.auth_service.service;

import cl.vet.auth_service.model.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expiracion;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration}") long expiracion){
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expiracion = expiracion;
    }

    public String generarToken(Usuario u) {
        Date ahora = new Date();
        return Jwts.builder()
                .subject(u.getEmail())
                .claim("id", u.getId())
                .claim("rol", u.getRol().name())
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expiracion))
                .signWith(key)
                .compact();
    }
}
