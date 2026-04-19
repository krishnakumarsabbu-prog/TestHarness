package com.alertsportal.model;

import com.alertsportal.config.JsonListConverter;
import com.alertsportal.config.JsonMapConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "simulation_logs")
public class SimulationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "scenario_id")
    private UUID scenarioId;

    @Column(nullable = false)
    private String channel;

    @Convert(converter = JsonMapConverter.class)
    @Column(columnDefinition = "clob")
    private Map<String, Object> config;

    @Column(columnDefinition = "clob")
    private String payload;

    @Column(nullable = false)
    private String status = "success";

    @Column(name = "http_status")
    private Integer httpStatus;

    @Column(name = "response_time_ms")
    private Integer responseTimeMs = 0;

    @Column
    private String message;

    @Convert(converter = JsonListConverter.class)
    @Column(columnDefinition = "clob")
    private List<Map<String, String>> logs;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
}
