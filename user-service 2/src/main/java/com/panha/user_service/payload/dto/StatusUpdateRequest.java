package com.panha.user_service.payload.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull(message = "blocked is mandatory")
    private Boolean blocked;
    
}
