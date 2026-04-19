package com.alertsportal.model;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "message_id", nullable = false)
    private String messageId;

    @Column(name = "alert_name", nullable = false)
    private String alertName;

    @Column(nullable = false)
    private String channel;

    @Column(nullable = false)
    private String status = "Pending";

    @Column(name = "created_time")
    private OffsetDateTime createdTime;

    @Column(name = "processing_time_ms")
    private Integer processingTimeMs = 0;

    @Column(name = "inbound_source")
    private String inboundSource;

    @Column(name = "message_key_type")
    private String messageKeyType;

    @Column(name = "message_value")
    private String messageValue;

    @Column(name = "template_used")
    private String templateUsed;

    @Column(name = "trigger_source")
    private String triggerSource;

    @Column(name = "delivery_status")
    private String deliveryStatus;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> payload;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, String>> logs;

    @PrePersist
    protected void onCreate() {
        if (createdTime == null) {
            createdTime = OffsetDateTime.now();
        }
    }
}
