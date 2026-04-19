package com.alertsportal.controller;

import com.alertsportal.dto.BatchJobRequest;
import com.alertsportal.model.BatchJob;
import com.alertsportal.service.BatchJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/batch-jobs")
@RequiredArgsConstructor
public class BatchJobController {

    private final BatchJobService service;

    @GetMapping
    public ResponseEntity<List<BatchJob>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchJob> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<BatchJob> create(@Valid @RequestBody BatchJobRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<BatchJob> execute(@PathVariable UUID id) {
        return ResponseEntity.ok(service.execute(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
