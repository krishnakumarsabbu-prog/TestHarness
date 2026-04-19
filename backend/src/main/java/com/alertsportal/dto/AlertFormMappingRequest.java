package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AlertFormMappingRequest {
    @NotBlank
    private String alertType;
    @NotBlank
    private String sourceType;
    @NotNull
    private UUID formId;
}
