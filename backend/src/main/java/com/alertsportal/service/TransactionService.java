package com.alertsportal.service;

import com.alertsportal.dto.TransactionMetricsResponse;
import com.alertsportal.dto.TransactionRequest;
import com.alertsportal.exception.ResourceNotFoundException;
import com.alertsportal.model.Transaction;
import com.alertsportal.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;

    public Page<Transaction> findAll(
            String inboundSource,
            String messageKeyType,
            String channel,
            String status,
            String dateFrom,
            String dateTo,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        OffsetDateTime from = dateFrom != null ? OffsetDateTime.parse(dateFrom) : null;
        OffsetDateTime to = dateTo != null ? OffsetDateTime.parse(dateTo) : null;

        return repository.findByFilters(
            inboundSource, messageKeyType, channel, status, from, to, pageable
        );
    }

    public Transaction findById(UUID id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + id));
    }

    public Transaction create(TransactionRequest req) {
        Transaction tx = new Transaction();
        mapRequestToEntity(req, tx);
        return repository.save(tx);
    }

    public Transaction update(UUID id, TransactionRequest req) {
        Transaction tx = findById(id);
        mapRequestToEntity(req, tx);
        return repository.save(tx);
    }

    public TransactionMetricsResponse getMetrics() {
        long total = repository.count();
        long success = repository.countByStatus("Success");
        long failed = repository.countByStatus("Failed");
        long pending = repository.countByStatus("Pending");
        long slaBreaches = repository.countSlaBreaches();
        return new TransactionMetricsResponse(total, success, failed, pending, slaBreaches);
    }

    private void mapRequestToEntity(TransactionRequest req, Transaction tx) {
        tx.setMessageId(req.getMessageId());
        tx.setAlertName(req.getAlertName());
        tx.setChannel(req.getChannel());
        tx.setStatus(req.getStatus() != null ? req.getStatus() : "Pending");
        tx.setCreatedTime(req.getCreatedTime() != null ? req.getCreatedTime() : OffsetDateTime.now());
        tx.setProcessingTimeMs(req.getProcessingTimeMs() != null ? req.getProcessingTimeMs() : 0);
        tx.setInboundSource(req.getInboundSource());
        tx.setMessageKeyType(req.getMessageKeyType());
        tx.setMessageValue(req.getMessageValue());
        tx.setTemplateUsed(req.getTemplateUsed());
        tx.setTriggerSource(req.getTriggerSource());
        tx.setDeliveryStatus(req.getDeliveryStatus());
        tx.setPayload(req.getPayload());
        tx.setLogs(req.getLogs());
    }
}
