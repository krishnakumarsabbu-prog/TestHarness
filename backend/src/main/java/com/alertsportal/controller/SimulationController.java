package com.alertsportal.controller;

import com.alertsportal.dto.SimulateMessageRequest;
import com.alertsportal.dto.SimulationResponse;
import com.alertsportal.dto.SimulationScenarioRequest;
import com.alertsportal.model.SimulationLog;
import com.alertsportal.model.SimulationScenario;
import com.alertsportal.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/simulate")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService service;

    @GetMapping("/scenarios")
    public ResponseEntity<List<SimulationScenario>> getAllScenarios() {
        return ResponseEntity.ok(service.findAllScenarios());
    }

    @GetMapping("/scenarios/{id}")
    public ResponseEntity<SimulationScenario> getScenarioById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findScenarioById(id));
    }

    @PostMapping("/scenarios")
    public ResponseEntity<SimulationScenario> createScenario(@Valid @RequestBody SimulationScenarioRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createScenario(req));
    }

    @PutMapping("/scenarios/{id}")
    public ResponseEntity<SimulationScenario> updateScenario(@PathVariable UUID id, @Valid @RequestBody SimulationScenarioRequest req) {
        return ResponseEntity.ok(service.updateScenario(id, req));
    }

    @DeleteMapping("/scenarios/{id}")
    public ResponseEntity<Void> deleteScenario(@PathVariable UUID id) {
        service.deleteScenario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/send")
    public ResponseEntity<SimulationResponse> simulate(@Valid @RequestBody SimulateMessageRequest req) {
        return ResponseEntity.ok(service.simulate(req));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SimulationLog>> getRecentLogs() {
        return ResponseEntity.ok(service.getRecentLogs());
    }
}
