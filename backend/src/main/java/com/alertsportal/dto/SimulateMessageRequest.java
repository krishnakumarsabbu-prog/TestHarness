package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class SimulateMessageRequest {
    @NotBlank
    private String channel;
    private Map<String, Object> config;
    private String payload;
    private UUID scenarioId;
}
