package com.alertsportal.repository;

import com.alertsportal.model.SimulationScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SimulationScenarioRepository extends JpaRepository<SimulationScenario, UUID> {

    List<SimulationScenario> findByChannel(String channel);

    List<SimulationScenario> findAllByOrderByCreatedAtDesc();
}
