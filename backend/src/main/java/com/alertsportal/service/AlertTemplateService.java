package com.alertsportal.service;

import com.alertsportal.dto.AlertTemplateRequest;
import com.alertsportal.exception.ResourceNotFoundException;
import com.alertsportal.model.AlertTemplate;
import com.alertsportal.repository.AlertTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlertTemplateService {

    private final AlertTemplateRepository repository;

    public List<AlertTemplate> findAll(String name, String channel, String language, String version) {
        if (name == null && channel == null && language == null && version == null) {
            return repository.findAll();
        }
        return repository.findByFilters(name, channel, language, version);
    }

    public AlertTemplate findById(UUID id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Template not found: " + id));
    }

    public AlertTemplate create(AlertTemplateRequest req) {
        AlertTemplate template = new AlertTemplate();
        mapRequestToEntity(req, template);
        return repository.save(template);
    }

    public AlertTemplate update(UUID id, AlertTemplateRequest req) {
        AlertTemplate template = findById(id);
        mapRequestToEntity(req, template);
        return repository.save(template);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Template not found: " + id);
        }
        repository.deleteById(id);
    }

    private void mapRequestToEntity(AlertTemplateRequest req, AlertTemplate template) {
        template.setName(req.getName());
        template.setChannel(req.getChannel());
        template.setLanguage(req.getLanguage() != null ? req.getLanguage() : "English");
        template.setVersion(req.getVersion());
        template.setSubject(req.getSubject());
        template.setBody(req.getBody());
        template.setHtmlTemplate(req.getHtmlTemplate());
        template.setVariables(req.getVariables());
        template.setStatus(req.getStatus() != null ? req.getStatus() : "active");
        template.setMetadata(req.getMetadata());
    }
}
