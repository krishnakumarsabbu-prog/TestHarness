package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AlertTemplateRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String channel;
    private String language = "English";
    @NotBlank
    private String version;
    private String subject;
    private String body;
    private String htmlTemplate;
    private List<String> variables;
    private String status = "active";
    private Map<String, Object> metadata;
}
