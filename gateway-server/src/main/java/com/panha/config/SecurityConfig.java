package com.panha.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http
    ) {

        http
                .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/auth/**").permitAll()
                .pathMatchers("/api/notification/ws/**").permitAll()
                .pathMatchers(
                        "/api/categories/salon-owner/**",
                        "/api/notifications/salon-owner/**",
                        // "/api/service-offering/salon-owner/**"
                        "/api/service-offerings/salon-owner/**"
                )
                // .hasRole("SALON_OWNER")
                .hasAnyRole("SALON_OWNER", "ADMIN")
                .pathMatchers("/api/users/**")
                .hasAnyRole("CUSTOMER", "SALON_OWNER", "ADMIN")
                .pathMatchers(
                        "/api/salons/**",
                        "/api/categories/**",
                        "/api/notifications/**",
                        "/api/bookings/**",
                        "/api/payments/**",
                        "/api/service-offering/**",
                        "/api/service-offerings/**",
                        "/api/reviews/**"
                )
                .hasAnyRole("CUSTOMER", "SALON_OWNER", "ADMIN")
                .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2
                        -> oauth2.jwt(jwt
                        -> jwt.jwtAuthenticationConverter(
                        grantAuthoritiesExtractor()
                )
                )
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors
                        -> cors.configurationSource(
                        corsConfigurationSource()
                )
                );

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration
                = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5170",
                "http://localhost:5173",
                "http://localhost:5000"
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"
        ));

        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type"
        ));

        configuration.setExposedHeaders(
                Collections.singletonList("Authorization")
        );

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source
                = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    private Converter<
        Jwt, ? extends Mono<? extends AbstractAuthenticationToken>> grantAuthoritiesExtractor() {

        JwtAuthenticationConverter converter
                = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(
                new KeycloakRoleConverter()
        );

        return new ReactiveJwtAuthenticationConverterAdapter(
                converter
        );
    }
}
