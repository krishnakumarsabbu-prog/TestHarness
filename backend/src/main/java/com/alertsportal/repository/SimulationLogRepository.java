package com.alertsportal.repository;

import com.alertsportal.model.SimulationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SimulationLogRepository extends JpaRepository<SimulationLog, UUID> {

    List<SimulationLog> findByScenarioIdOrderByCreatedAtDesc(UUID scenarioId);

    List<SimulationLog> findTop20ByOrderByCreatedAtDesc();
}
