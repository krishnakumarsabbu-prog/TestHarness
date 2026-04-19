package com.alertsportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Data
public class TransactionRequest {
    @NotBlank
    private String messageId;
    @NotBlank
    private String alertName;
    @NotBlank
    private String channel;
    private String status = "Pending";
    private OffsetDateTime createdTime;
    private Integer processingTimeMs = 0;
    private String inboundSource;
    private String messageKeyType;
    private String messageValue;
    private String templateUsed;
    private String triggerSource;
    private String deliveryStatus;
    private Map<String, Object> payload;
    private List<Map<String, String>> logs;
}
