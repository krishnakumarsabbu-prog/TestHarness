package com.alertsportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionMetricsResponse {
    private long total;
    private long success;
    private long failed;
    private long pending;
    private long slaBreaches;
}
