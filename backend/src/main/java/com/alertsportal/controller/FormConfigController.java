package com.alertsportal.controller;

import com.alertsportal.dto.AlertFormMappingRequest;
import com.alertsportal.dto.FormConfigRequest;
import com.alertsportal.model.AlertFormMapping;
import com.alertsportal.model.FormConfig;
import com.alertsportal.service.FormConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
public class FormConfigController {

    private final FormConfigService service;

    @GetMapping
    public ResponseEntity<List<FormConfig>> getAllForms() {
        return ResponseEntity.ok(service.findAllForms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormConfig> getFormById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findFormById(id));
    }

    @PostMapping
    public ResponseEntity<FormConfig> createForm(@Valid @RequestBody FormConfigRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createForm(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormConfig> updateForm(@PathVariable UUID id, @Valid @RequestBody FormConfigRequest req) {
        return ResponseEntity.ok(service.updateForm(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable UUID id) {
        service.deleteForm(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mappings")
    public ResponseEntity<List<AlertFormMapping>> getAllMappings() {
        return ResponseEntity.ok(service.findAllMappings());
    }

    @PostMapping("/mappings")
    public ResponseEntity<AlertFormMapping> createMapping(@Valid @RequestBody AlertFormMappingRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createMapping(req));
    }

    @DeleteMapping("/mappings/{id}")
    public ResponseEntity<Void> deleteMapping(@PathVariable UUID id) {
        service.deleteMapping(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/resolve")
    public ResponseEntity<?> resolveForm(
            @RequestParam String alertType,
            @RequestParam String sourceType) {
        return service.resolveFormForAlert(alertType, sourceType)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
