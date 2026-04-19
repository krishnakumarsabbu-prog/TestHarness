package com.alertsportal.repository;

import com.alertsportal.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:inboundSource IS NULL OR t.inboundSource = :inboundSource) AND " +
           "(:messageKeyType IS NULL OR t.messageKeyType = :messageKeyType) AND " +
           "(:channel IS NULL OR t.channel = :channel) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:dateFrom IS NULL OR t.createdTime >= :dateFrom) AND " +
           "(:dateTo IS NULL OR t.createdTime <= :dateTo) " +
           "ORDER BY t.createdTime DESC")
    Page<Transaction> findByFilters(
        @Param("inboundSource") String inboundSource,
        @Param("messageKeyType") String messageKeyType,
        @Param("channel") String channel,
        @Param("status") String status,
        @Param("dateFrom") OffsetDateTime dateFrom,
        @Param("dateTo") OffsetDateTime dateTo,
        Pageable pageable
    );

    long countByStatus(String status);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.processingTimeMs > 3000")
    long countSlaBreaches();
}
