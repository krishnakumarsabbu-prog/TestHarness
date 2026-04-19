package com.alertsportal.service;

import com.alertsportal.dto.AlertFormMappingRequest;
import com.alertsportal.dto.FormConfigRequest;
import com.alertsportal.exception.ResourceNotFoundException;
import com.alertsportal.model.AlertFormMapping;
import com.alertsportal.model.FormConfig;
import com.alertsportal.repository.AlertFormMappingRepository;
import com.alertsportal.repository.FormConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FormConfigService {

    private final FormConfigRepository formConfigRepository;
    private final AlertFormMappingRepository mappingRepository;

    public List<FormConfig> findAllForms() {
        return formConfigRepository.findAll();
    }

    public FormConfig findFormById(UUID id) {
        return formConfigRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Form config not found: " + id));
    }

    public FormConfig createForm(FormConfigRequest req) {
        FormConfig form = new FormConfig();
        form.setName(req.getName());
        form.setDescription(req.getDescription());
        form.setFields(req.getFields());
        return formConfigRepository.save(form);
    }

    public FormConfig updateForm(UUID id, FormConfigRequest req) {
        FormConfig form = findFormById(id);
        form.setName(req.getName());
        form.setDescription(req.getDescription());
        form.setFields(req.getFields());
        return formConfigRepository.save(form);
    }

    public void deleteForm(UUID id) {
        if (!formConfigRepository.existsById(id)) {
            throw new ResourceNotFoundException("Form config not found: " + id);
        }
        formConfigRepository.deleteById(id);
    }

    public List<AlertFormMapping> findAllMappings() {
        return mappingRepository.findAll();
    }

    public AlertFormMapping createMapping(AlertFormMappingRequest req) {
        if (mappingRepository.existsByAlertTypeAndSourceType(req.getAlertType(), req.getSourceType())) {
            throw new IllegalArgumentException(
                "Mapping already exists for alertType=" + req.getAlertType() + " sourceType=" + req.getSourceType()
            );
        }
        if (!formConfigRepository.existsById(req.getFormId())) {
            throw new ResourceNotFoundException("Form config not found: " + req.getFormId());
        }
        AlertFormMapping mapping = new AlertFormMapping();
        mapping.setAlertType(req.getAlertType());
        mapping.setSourceType(req.getSourceType());
        mapping.setFormId(req.getFormId());
        return mappingRepository.save(mapping);
    }

    public void deleteMapping(UUID id) {
        if (!mappingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mapping not found: " + id);
        }
        mappingRepository.deleteById(id);
    }

    public Optional<FormConfig> resolveFormForAlert(String alertType, String sourceType) {
        return mappingRepository.findByAlertTypeAndSourceType(alertType, sourceType)
            .flatMap(m -> formConfigRepository.findById(m.getFormId()));
    }
}
