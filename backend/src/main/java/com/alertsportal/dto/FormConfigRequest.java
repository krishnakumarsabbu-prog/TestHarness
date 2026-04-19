package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FormConfigRequest {
    @NotBlank
    private String name;
    private String description;
    private List<Map<String, Object>> fields;
}
