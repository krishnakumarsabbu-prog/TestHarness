import { api } from './apiClient'
import type { Scenario, SimulatorMessage, SimulationResponse } from '../pages/message-simulator/types'

export interface SimulationScenarioRequest {
  name: string
  description?: string
  channel: string
  config: Record<string, unknown>
  payload: string
}

export interface SimulateRequest {
  channel: string
  config: Record<string, unknown>
  payload: string
  scenarioId?: string
}

export interface SimulationApiResponse {
  status: string
  httpStatus?: number
  responseTime?: number
  message?: string
  logs: Array<{ level: string; message: string; timestamp: string }>
  timestamp?: string
  logId?: string
}

export const simulationService = {
  getAllScenarios: () => api.get<Scenario[]>('/api/simulate/scenarios'),

  getScenarioById: (id: string) => api.get<Scenario>(`/api/simulate/scenarios/${id}`),

  createScenario: (req: SimulationScenarioRequest) =>
    api.post<Scenario>('/api/simulate/scenarios', req),

  updateScenario: (id: string, req: SimulationScenarioRequest) =>
    api.put<Scenario>(`/api/simulate/scenarios/${id}`, req),

  deleteScenario: (id: string) => api.delete<void>(`/api/simulate/scenarios/${id}`),

  send: (msg: SimulatorMessage, scenarioId?: string): Promise<SimulationApiResponse> => {
    const req: SimulateRequest = {
      channel: msg.channel,
      config: msg.config as unknown as Record<string, unknown>,
      payload: msg.payload,
      scenarioId,
    }
    return api.post<SimulationApiResponse>('/api/simulate/send', req)
  },

  getRecentLogs: () => api.get<SimulationApiResponse[]>('/api/simulate/logs'),
}

export function toSimulationResponse(res: SimulationApiResponse): SimulationResponse {
  return {
    status: res.status as SimulationResponse['status'],
    httpStatus: res.httpStatus,
    responseTime: res.responseTime,
    message: res.message,
    logs: (res.logs || []).map((l) => ({
      level: l.level as 'info' | 'warn' | 'error' | 'debug',
      message: l.message,
      timestamp: l.timestamp,
    })),
    timestamp: res.timestamp,
  }
}
