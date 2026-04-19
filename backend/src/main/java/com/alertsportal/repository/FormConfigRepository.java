package com.alertsportal.repository;

import com.alertsportal.model.FormConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FormConfigRepository extends JpaRepository<FormConfig, UUID> {
}
