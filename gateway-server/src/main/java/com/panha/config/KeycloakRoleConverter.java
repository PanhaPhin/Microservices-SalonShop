package com.panha.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {

        Collection<GrantedAuthority> authorities = new ArrayList<>();

        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.get("roles") != null) {
            List<String> roles = (List<String>) realmAccess.get("roles");
            roles.forEach(role
                    -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            );
        }

        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess != null) {
            resourceAccess.forEach((client, clientDetails) -> {
                Map<String, Object> clientMap = (Map<String, Object>) clientDetails;
                if (clientMap.get("roles") != null) {
                    List<String> roles = (List<String>) clientMap.get("roles");
                    roles.forEach(role
                            -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                    );
                }
            });
        }

        return authorities;
    }
}
