package com.alertsportal.service;

import com.alertsportal.dto.SimulateMessageRequest;
import com.alertsportal.dto.SimulationResponse;
import com.alertsportal.dto.SimulationScenarioRequest;
import com.alertsportal.exception.ResourceNotFoundException;
import com.alertsportal.model.SimulationLog;
import com.alertsportal.model.SimulationScenario;
import com.alertsportal.repository.SimulationLogRepository;
import com.alertsportal.repository.SimulationScenarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final SimulationScenarioRepository scenarioRepository;
    private final SimulationLogRepository logRepository;

    private final Random random = new Random();

    public List<SimulationScenario> findAllScenarios() {
        return scenarioRepository.findAllByOrderByCreatedAtDesc();
    }

    public SimulationScenario findScenarioById(UUID id) {
        return scenarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Scenario not found: " + id));
    }

    public SimulationScenario createScenario(SimulationScenarioRequest req) {
        SimulationScenario scenario = new SimulationScenario();
        scenario.setName(req.getName());
        scenario.setDescription(req.getDescription());
        scenario.setChannel(req.getChannel());
        scenario.setConfig(req.getConfig());
        scenario.setPayload(req.getPayload());
        return scenarioRepository.save(scenario);
    }

    public SimulationScenario updateScenario(UUID id, SimulationScenarioRequest req) {
        SimulationScenario scenario = findScenarioById(id);
        scenario.setName(req.getName());
        scenario.setDescription(req.getDescription());
        scenario.setChannel(req.getChannel());
        scenario.setConfig(req.getConfig());
        scenario.setPayload(req.getPayload());
        return scenarioRepository.save(scenario);
    }

    public void deleteScenario(UUID id) {
        if (!scenarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Scenario not found: " + id);
        }
        scenarioRepository.deleteById(id);
    }

    public SimulationResponse simulate(SimulateMessageRequest req) {
        boolean success = random.nextDouble() > 0.15;
        int responseTime = 45 + random.nextInt(806);
        String timestamp = OffsetDateTime.now().toString();
        String channel = req.getChannel();

        List<Map<String, String>> logs = buildLogs(channel, req.getConfig(), success, timestamp);

        String status = success ? "success" : "failure";
        int httpStatus = success ? 200 : (channel.equals("webservice") ? 503 : 0);
        String message = buildMessage(channel, success, req.getConfig());

        SimulationLog logEntry = new SimulationLog();
        logEntry.setScenarioId(req.getScenarioId());
        logEntry.setChannel(channel);
        logEntry.setConfig(req.getConfig());
        logEntry.setPayload(req.getPayload());
        logEntry.setStatus(status);
        logEntry.setHttpStatus(httpStatus > 0 ? httpStatus : null);
        logEntry.setResponseTimeMs(responseTime);
        logEntry.setMessage(message);
        logEntry.setLogs(logs);
        SimulationLog saved = logRepository.save(logEntry);

        SimulationResponse response = new SimulationResponse();
        response.setStatus(status);
        response.setHttpStatus(httpStatus > 0 ? httpStatus : null);
        response.setResponseTime(responseTime);
        response.setMessage(message);
        response.setLogs(logs);
        response.setTimestamp(timestamp);
        response.setLogId(saved.getId().toString());
        return response;
    }

    public List<SimulationLog> getRecentLogs() {
        return logRepository.findTop20ByOrderByCreatedAtDesc();
    }

    private List<Map<String, String>> buildLogs(String channel, Map<String, Object> config, boolean success, String ts) {
        List<Map<String, String>> logs = new ArrayList<>();
        String topic = config != null && config.get("kafka") != null
            ? ((Map<?, ?>) config.get("kafka")).get("topic") + "" : "unknown";
        String queue = config != null && config.get("mq") != null
            ? ((Map<?, ?>) config.get("mq")).get("queue") + "" : "unknown";
        String endpoint = config != null && config.get("webservice") != null
            ? ((Map<?, ?>) config.get("webservice")).get("endpoint") + "" : "/api/endpoint";

        if ("kafka".equals(channel)) {
            logs.add(log("info", "Connecting to Kafka broker", ts));
            logs.add(log("info", "Connection established", ts));
            logs.add(log("debug", "Serializing payload to bytes", ts));
            if (success) {
                logs.add(log("info", "Message published to topic: " + topic, ts));
                logs.add(log("info", "Acknowledgement received, offset=42", ts));
            } else {
                logs.add(log("error", "Connection refused by Kafka broker", ts));
                logs.add(log("error", "Failed to publish message to topic: " + topic, ts));
            }
        } else if ("mq".equals(channel)) {
            logs.add(log("info", "Connecting to IBM MQ manager", ts));
            logs.add(log("info", "Queue manager connected", ts));
            logs.add(log("debug", "Opening queue: " + queue, ts));
            if (success) {
                logs.add(log("info", "Message put to queue: " + queue, ts));
                logs.add(log("info", "MsgId: " + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), ts));
            } else {
                logs.add(log("warn", "Authorization error: insufficient permissions", ts));
                logs.add(log("error", "Failed to put message to queue: " + queue, ts));
            }
        } else {
            logs.add(log("debug", "Resolving DNS for endpoint: " + endpoint, ts));
            logs.add(log("info", "Sending HTTP request to: " + endpoint, ts));
            if (success) {
                logs.add(log("info", "HTTP 200 OK received", ts));
                logs.add(log("info", "Response parsed successfully", ts));
            } else {
                logs.add(log("error", "HTTP 503 Service Unavailable", ts));
                logs.add(log("error", "Request failed after timeout", ts));
            }
        }
        return logs;
    }

    private Map<String, String> log(String level, String message, String ts) {
        Map<String, String> entry = new LinkedHashMap<>();
        entry.put("level", level);
        entry.put("message", message);
        entry.put("timestamp", ts);
        return entry;
    }

    private String buildMessage(String channel, boolean success, Map<String, Object> config) {
        if (success) {
            return switch (channel) {
                case "kafka" -> "Message published to Kafka topic successfully";
                case "mq" -> "Message enqueued in IBM MQ successfully";
                default -> "HTTP request completed with 200 OK";
            };
        } else {
            return switch (channel) {
                case "kafka" -> "Failed to publish: Kafka broker connection refused";
                case "mq" -> "Failed to enqueue: IBM MQ authorization error";
                default -> "Request failed: 503 Service Unavailable";
            };
        }
    }
}
