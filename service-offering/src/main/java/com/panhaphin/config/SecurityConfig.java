package com.panhaphin.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/api/service-offering/**",
                        "/api/service-offerings/**"
                )
                .authenticated()
                .anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2
                        -> oauth2.jwt(jwt
                        -> jwt.jwtAuthenticationConverter(
                        keycloakJwtAuthenticationConverter()
                )
                )
                );

        return http.build();
    }

    @Bean
    public Converter<Jwt, ? extends AbstractAuthenticationToken>
            keycloakJwtAuthenticationConverter() {

        return jwt -> {

            Collection<GrantedAuthority> authorities
                    = new ArrayList<>();

            // =========================
            // 1. REALM ROLES
            // =========================
            Map<String, Object> realmAccess
                    = jwt.getClaim("realm_access");

            if (realmAccess != null) {

                Object rolesObject
                        = realmAccess.get("roles");

                if (rolesObject instanceof Collection<?> collection) {

                    for (Object role : collection) {

                        authorities.add(
                                new SimpleGrantedAuthority(
                                        "ROLE_" + role.toString().toUpperCase()
                                )
                        );
                    }
                }
            }

            // =========================
            // 2. CLIENT ROLES
            // =========================
            Map<String, Object> resourceAccess
                    = jwt.getClaim("resource_access");

            if (resourceAccess != null) {

                resourceAccess.forEach((client, clientDetails) -> {

                    if (clientDetails instanceof Map<?, ?> clientMap) {

                        Object rolesObject
                                = clientMap.get("roles");

                        if (rolesObject instanceof Collection<?> collection) {

                            for (Object role : collection) {

                                authorities.add(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role.toString().toUpperCase()
                                        )
                                );
                            }
                        }
                    }
                });
            }

            // DEBUG
            System.out.println(
                    "========== SERVICE-OFFERING ROLES =========="
            );

            System.out.println(
                    "Authorities = " + authorities
            );

            System.out.println(
                    "============================================"
            );

            return new JwtAuthenticationToken(
                    jwt,
                    authorities
            );
        };
    }
}
