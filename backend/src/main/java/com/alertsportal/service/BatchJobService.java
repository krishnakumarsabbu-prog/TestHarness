package com.alertsportal.service;

import com.alertsportal.dto.BatchJobRequest;
import com.alertsportal.exception.ResourceNotFoundException;
import com.alertsportal.model.BatchJob;
import com.alertsportal.repository.BatchJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BatchJobService {

    private final BatchJobRepository repository;

    public List<BatchJob> findAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public BatchJob findById(UUID id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Batch job not found: " + id));
    }

    public BatchJob create(BatchJobRequest req) {
        BatchJob job = new BatchJob();
        job.setName(req.getName());
        job.setType(req.getType() != null ? req.getType() : "standard");
        job.setStatus("pending");
        job.setConfig(req.getConfig());
        return repository.save(job);
    }

    public BatchJob execute(UUID id) {
        BatchJob job = findById(id);
        if (!"pending".equals(job.getStatus()) && !"failed".equals(job.getStatus())) {
            throw new IllegalArgumentException("Job cannot be executed in status: " + job.getStatus());
        }
        job.setStatus("running");
        job.setStartedAt(OffsetDateTime.now());
        job = repository.save(job);

        boolean success = Math.random() > 0.1;
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        if (success) {
            job.setStatus("completed");
            Map<String, Object> result = new HashMap<>();
            result.put("processedRecords", (int)(Math.random() * 1000) + 100);
            result.put("successCount", (int)(Math.random() * 950) + 90);
            result.put("failureCount", (int)(Math.random() * 10));
            job.setResult(result);
        } else {
            job.setStatus("failed");
            job.setErrorMessage("Job failed due to downstream service unavailability");
        }
        job.setCompletedAt(OffsetDateTime.now());
        return repository.save(job);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Batch job not found: " + id);
        }
        repository.deleteById(id);
    }
}
