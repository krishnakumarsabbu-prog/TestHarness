package com.alertsportal.repository;

import com.alertsportal.model.AlertFormMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlertFormMappingRepository extends JpaRepository<AlertFormMapping, UUID> {

    Optional<AlertFormMapping> findByAlertTypeAndSourceType(String alertType, String sourceType);

    List<AlertFormMapping> findByFormId(UUID formId);

    boolean existsByAlertTypeAndSourceType(String alertType, String sourceType);
}
