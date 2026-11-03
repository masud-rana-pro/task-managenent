package com.fifotech.task.security;
import com.fifotech.task.domain.User; import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import javax.crypto.SecretKey; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import java.nio.charset.StandardCharsets; import java.util.*;
@Service public class JwtService {
 private final SecretKey key; private final long expiration;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-ms}") long expiration){byte[] bytes=Base64.getDecoder().decode(secret);if(bytes.length<32)throw new IllegalArgumentException("JWT_SECRET must decode to at least 32 bytes");this.key=Keys.hmacShaKeyFor(bytes);this.expiration=expiration;}
 public String generate(User user){return Jwts.builder().subject(user.getEmail()).claim("role",user.getRole().name()).claim("id",user.getId()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expiration)).signWith(key).compact();}
 public String subject(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
}
