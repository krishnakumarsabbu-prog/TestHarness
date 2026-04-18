export type ChannelType = 'kafka' | 'mq' | 'webservice'
export type PayloadFormat = 'json' | 'xml'
export type ResponseStatus = 'success' | 'failure' | 'idle' | 'sending'

export interface Environment {
  id: string
  label: string
  url: string
}

export interface KafkaConfig {
  topic: string
  partition?: number
  key?: string
}

export interface MQConfig {
  queue: string
  correlationId?: string
}

export interface WebServiceConfig {
  service: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
}

export interface ChannelConfig {
  environment: string
  format: PayloadFormat
  kafka?: KafkaConfig
  mq?: MQConfig
  webservice?: WebServiceConfig
}

export interface SimulatorMessage {
  channel: ChannelType
  config: ChannelConfig
  payload: string
}

export interface SimulationResponse {
  status: ResponseStatus
  httpStatus?: number
  responseTime?: number
  message?: string
  logs: LogEntry[]
  timestamp?: string
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
}

export interface Scenario {
  id: string
  name: string
  description?: string
  channel: ChannelType
  config: ChannelConfig
  payload: string
  createdAt: string
}
