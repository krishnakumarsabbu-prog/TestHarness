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
@Table(name = "alert_templates")
public class AlertTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String channel;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String version;

    private String subject;

    @Column(columnDefinition = "clob")
    private String body;

    @Column(name = "html_template", columnDefinition = "clob")
    private String htmlTemplate;

    @Convert(converter = JsonListConverter.class)
    @Column(columnDefinition = "clob")
    private List<String> variables;

    @Column(nullable = false)
    private String status = "active";

    @Convert(converter = JsonMapConverter.class)
    @Column(columnDefinition = "clob")
    private Map<String, Object> metadata;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
