package com.alertsportal.controller;

import com.alertsportal.dto.AlertTemplateRequest;
import com.alertsportal.model.AlertTemplate;
import com.alertsportal.service.AlertTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class AlertTemplateController {

    private final AlertTemplateService service;

    @GetMapping
    public ResponseEntity<List<AlertTemplate>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String version) {
        return ResponseEntity.ok(service.findAll(name, channel, language, version));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertTemplate> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<AlertTemplate> create(@Valid @RequestBody AlertTemplateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlertTemplate> update(@PathVariable UUID id, @Valid @RequestBody AlertTemplateRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
