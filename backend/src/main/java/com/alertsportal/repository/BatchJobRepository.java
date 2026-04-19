package com.alertsportal.repository;

import com.alertsportal.model.BatchJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BatchJobRepository extends JpaRepository<BatchJob, UUID> {

    List<BatchJob> findByStatus(String status);

    List<BatchJob> findAllByOrderByCreatedAtDesc();
}
