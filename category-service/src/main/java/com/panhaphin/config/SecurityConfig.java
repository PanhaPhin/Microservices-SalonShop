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
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                // Disable CSRF because this is a stateless REST API
                .csrf(csrf -> csrf.disable())

                // Do not create HTTP sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers(
                                "/auth/**",
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Everything else requires JWT authentication
                        .anyRequest().authenticated()
                )

                // Keycloak JWT authentication
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        keycloakJwtAuthenticationConverter()
                                )
                        )
                );

        return http.build();
    }


    @Bean
    public Converter<Jwt, AbstractAuthenticationToken>
    keycloakJwtAuthenticationConverter() {

        return jwt -> {

            System.out.println(
                    "========== JWT DEBUG =========="
            );

            Collection<GrantedAuthority> authorities =
                    new ArrayList<>();

        

            Map<String, Object> realmAccess =
                    jwt.getClaim("realm_access");

            System.out.println(
                    "realm_access = " + realmAccess
            );

            if (realmAccess != null) {

                Object rolesObject =
                        realmAccess.get("roles");

                System.out.println(
                        "realm roles = " + rolesObject
                );

                if (rolesObject instanceof Collection<?> roles) {

                    for (Object role : roles) {

                        String roleName =
                                role.toString();

                        System.out.println(
                                "Adding REALM ROLE_" + roleName
                        );

                        authorities.add(
                                new SimpleGrantedAuthority(
                                        "ROLE_" + roleName
                                )
                        );
                    }
                }
            }

            
    
            Map<String, Object> resourceAccess =
                    jwt.getClaim("resource_access");

            System.out.println(
                    "resource_access = " + resourceAccess
            );

            if (resourceAccess != null) {

                Object clientObject =
                        resourceAccess.get(
                                "salon-booking-client"
                        );

                System.out.println(
                        "salon-booking-client = "
                                + clientObject
                );

                if (clientObject instanceof Map<?, ?> clientMap) {

                    Object rolesObject =
                            clientMap.get("roles");

                    System.out.println(
                            "client roles = "
                                    + rolesObject
                    );

                    if (rolesObject instanceof Collection<?> roles) {

                        for (Object role : roles) {

                            String roleName =
                                    role.toString();

                            System.out.println(
                                    "Adding CLIENT ROLE_"
                                            + roleName
                            );

                            authorities.add(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + roleName
                                    )
                            );
                        }
                    }
                }
            }


            System.out.println(
                    "AUTHORITIES = " + authorities
            );

            System.out.println(
                    "preferred_username = "
                            + jwt.getClaimAsString(
                                    "preferred_username"
                            )
            );

            System.out.println(
                    "email = "
                            + jwt.getClaimAsString(
                                    "email"
                            )
            );

            System.out.println(
                    "================================"
            );


            return new JwtAuthenticationToken(
                    jwt,
                    authorities,
                    jwt.getClaimAsString(
                            "preferred_username"
                    )
            );
        };
    }
}