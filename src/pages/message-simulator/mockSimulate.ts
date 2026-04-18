import type { SimulatorMessage, SimulationResponse, LogEntry } from './types'

function makeTimestamp() {
  return new Date().toISOString()
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildKafkaLogs(msg: SimulatorMessage, success: boolean): LogEntry[] {
  const ts = makeTimestamp()
  const topic = msg.config.kafka?.topic ?? 'unknown'
  const env = msg.config.environment
  const logs: LogEntry[] = [
    { level: 'info', message: `Connecting to Kafka broker [${env}]`, timestamp: ts },
    { level: 'debug', message: `Bootstrap servers resolved: kafka-${env}.internal:9092`, timestamp: ts },
    { level: 'info', message: `Producer initialized, topic: ${topic}`, timestamp: ts },
  ]
  if (msg.config.kafka?.key) {
    logs.push({ level: 'debug', message: `Message key set: ${msg.config.kafka.key}`, timestamp: ts })
  }
  if (success) {
    logs.push({ level: 'info', message: `Message published to ${topic} [partition=${msg.config.kafka?.partition ?? 0}]`, timestamp: ts })
    logs.push({ level: 'info', message: `ACK received from broker`, timestamp: ts })
    logs.push({ level: 'debug', message: `Offset committed: ${randomBetween(1000, 9999)}`, timestamp: ts })
  } else {
    logs.push({ level: 'warn', message: `Retrying publish (attempt 1/3)...`, timestamp: ts })
    logs.push({ level: 'error', message: `Failed to publish message: Connection refused by broker`, timestamp: ts })
  }
  return logs
}

function buildMQLogs(msg: SimulatorMessage, success: boolean): LogEntry[] {
  const ts = makeTimestamp()
  const queue = msg.config.mq?.queue ?? 'UNKNOWN'
  const env = msg.config.environment
  const logs: LogEntry[] = [
    { level: 'info', message: `Connecting to MQ manager [${env}]`, timestamp: ts },
    { level: 'debug', message: `Channel SYSTEM.DEF.SVRCONN opened`, timestamp: ts },
    { level: 'info', message: `Queue ${queue} opened for OUTPUT`, timestamp: ts },
  ]
  if (msg.config.mq?.correlationId) {
    logs.push({ level: 'debug', message: `CorrelationId set: ${msg.config.mq.correlationId}`, timestamp: ts })
  }
  if (success) {
    logs.push({ level: 'info', message: `Message put to queue ${queue}`, timestamp: ts })
    logs.push({ level: 'debug', message: `MsgId: ${Math.random().toString(36).slice(2).toUpperCase()}`, timestamp: ts })
    logs.push({ level: 'info', message: `MQ connection closed cleanly`, timestamp: ts })
  } else {
    logs.push({ level: 'warn', message: `Queue depth exceeded threshold`, timestamp: ts })
    logs.push({ level: 'error', message: `MQRC 2035: Not Authorized to access queue`, timestamp: ts })
  }
  return logs
}

function buildWSLogs(msg: SimulatorMessage, success: boolean): LogEntry[] {
  const ts = makeTimestamp()
  const svc = msg.config.webservice?.service ?? 'unknown'
  const method = msg.config.webservice?.method ?? 'POST'
  const endpoint = msg.config.webservice?.endpoint ?? '/'
  const env = msg.config.environment
  const logs: LogEntry[] = [
    { level: 'info', message: `Resolving service endpoint [${env}]: ${svc}`, timestamp: ts },
    { level: 'debug', message: `DNS resolved: ${svc}.${env}.svc.cluster.local`, timestamp: ts },
    { level: 'info', message: `${method} ${endpoint} - sending request`, timestamp: ts },
    { level: 'debug', message: `Content-Type: application/json, Authorization: Bearer ***`, timestamp: ts },
  ]
  if (success) {
    logs.push({ level: 'info', message: `Response received: 200 OK`, timestamp: ts })
    logs.push({ level: 'debug', message: `Response body parsed successfully`, timestamp: ts })
  } else {
    logs.push({ level: 'warn', message: `Request timeout after 5000ms`, timestamp: ts })
    logs.push({ level: 'error', message: `503 Service Unavailable: upstream connect error`, timestamp: ts })
  }
  return logs
}

export async function simulateSend(msg: SimulatorMessage): Promise<SimulationResponse> {
  await new Promise((r) => setTimeout(r, randomBetween(600, 1800)))

  const shouldSucceed = Math.random() > 0.15
  const responseTime = randomBetween(45, 850)
  const ts = makeTimestamp()

  let logs: LogEntry[]
  if (msg.channel === 'kafka') {
    logs = buildKafkaLogs(msg, shouldSucceed)
  } else if (msg.channel === 'mq') {
    logs = buildMQLogs(msg, shouldSucceed)
  } else {
    logs = buildWSLogs(msg, shouldSucceed)
  }

  if (shouldSucceed) {
    return {
      status: 'success',
      httpStatus: msg.channel === 'webservice' ? 200 : undefined,
      responseTime,
      message: msg.channel === 'kafka'
        ? `Message successfully published to topic "${msg.config.kafka?.topic}"`
        : msg.channel === 'mq'
        ? `Message put to queue "${msg.config.mq?.queue}" successfully`
        : `Request completed with HTTP 200 OK`,
      logs,
      timestamp: ts,
    }
  } else {
    return {
      status: 'failure',
      httpStatus: msg.channel === 'webservice' ? 503 : undefined,
      responseTime,
      message: msg.channel === 'kafka'
        ? `Failed to publish message: broker connection refused`
        : msg.channel === 'mq'
        ? `MQ error: MQRC 2035 - Not Authorized`
        : `Service unavailable: upstream timeout`,
      logs,
      timestamp: ts,
    }
  }
}
