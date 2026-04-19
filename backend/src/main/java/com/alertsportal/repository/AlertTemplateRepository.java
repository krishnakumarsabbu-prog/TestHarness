package com.alertsportal.repository;

import com.alertsportal.model.AlertTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlertTemplateRepository extends JpaRepository<AlertTemplate, UUID> {

    List<AlertTemplate> findByNameContainingIgnoreCase(String name);

    List<AlertTemplate> findByChannel(String channel);

    List<AlertTemplate> findByLanguage(String language);

    List<AlertTemplate> findByVersion(String version);

    List<AlertTemplate> findByStatus(String status);

    @Query("SELECT t FROM AlertTemplate t WHERE " +
           "(:name IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:channel IS NULL OR t.channel = :channel) AND " +
           "(:language IS NULL OR t.language = :language) AND " +
           "(:version IS NULL OR t.version = :version)")
    List<AlertTemplate> findByFilters(
        @Param("name") String name,
        @Param("channel") String channel,
        @Param("language") String language,
        @Param("version") String version
    );
}
