package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class SimulationScenarioRequest {
    @NotBlank
    private String name;
    private String description;
    @NotBlank
    private String channel;
    private Map<String, Object> config;
    private String payload;
}
