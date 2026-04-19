package com.alertsportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulationResponse {
    private String status;
    private Integer httpStatus;
    private Integer responseTime;
    private String message;
    private List<Map<String, String>> logs;
    private String timestamp;
    private String logId;
}
