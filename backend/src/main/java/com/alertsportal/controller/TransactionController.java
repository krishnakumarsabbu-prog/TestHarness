package com.alertsportal.controller;

import com.alertsportal.dto.TransactionMetricsResponse;
import com.alertsportal.dto.TransactionRequest;
import com.alertsportal.model.Transaction;
import com.alertsportal.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @GetMapping
    public ResponseEntity<Page<Transaction>> getAll(
            @RequestParam(required = false) String inboundSource,
            @RequestParam(required = false) String messageKeyType,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdTime") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(
            service.findAll(inboundSource, messageKeyType, channel, status, dateFrom, dateTo, page, size, sortBy, sortDir)
        );
    }

    @GetMapping("/metrics")
    public ResponseEntity<TransactionMetricsResponse> getMetrics() {
        return ResponseEntity.ok(service.getMetrics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Transaction> create(@Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable UUID id, @Valid @RequestBody TransactionRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }
}
