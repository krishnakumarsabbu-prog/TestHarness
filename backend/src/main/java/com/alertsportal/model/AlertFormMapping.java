package com.alertsportal.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alert_form_mappings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"alert_type", "source_type"})
})
public class AlertFormMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "alert_type", nullable = false)
    private String alertType;

    @Column(name = "source_type", nullable = false)
    private String sourceType;

    @Column(name = "form_id")
    private UUID formId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
}
