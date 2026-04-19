package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class BatchJobRequest {
    @NotBlank
    private String name;
    private String type = "standard";
    private Map<String, Object> config;
}
