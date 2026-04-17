package com.panha.user_service.payload.dto;

import java.util.Map;

public class KeycloakRole {
    private String id;
    private String name;
    private String description;
    private boolean composite;
    private boolean clientRole;
    private String containerId;
    private Map<String, Object> attributes;
}
