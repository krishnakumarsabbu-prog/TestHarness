import { db } from '../store/memoryDb'
import { simulateSend } from '../pages/message-simulator/mockSimulate'
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
  getAllScenarios: (): Promise<Scenario[]> =>
    Promise.resolve(db.scenarios.getAll()),

  getScenarioById: (id: string): Promise<Scenario | undefined> =>
    Promise.resolve(db.scenarios.getById(id)),

  createScenario: (req: SimulationScenarioRequest): Promise<Scenario> =>
    Promise.resolve(
      db.scenarios.create({
        name: req.name,
        description: req.description || '',
        channel: req.channel as Scenario['channel'],
        config: req.config as unknown as Scenario['config'],
        payload: req.payload,
      })
    ),

  updateScenario: (id: string, req: SimulationScenarioRequest): Promise<Scenario | undefined> =>
    Promise.resolve(db.scenarios.update(id, {
      ...req,
      channel: req.channel as Scenario['channel'],
      config: req.config as unknown as Scenario['config'],
    })),

  deleteScenario: (id: string): Promise<void> => {
    db.scenarios.delete(id)
    return Promise.resolve()
  },

  send: async (msg: SimulatorMessage): Promise<SimulationApiResponse> => {
    const result = await simulateSend(msg)
    const log: SimulationApiResponse = {
      status: result.status,
      httpStatus: result.httpStatus,
      responseTime: result.responseTime,
      message: result.message,
      logs: result.logs,
      timestamp: result.timestamp,
      logId: `log-${Date.now()}`,
    }
    db.simLogs.add(log)
    return log
  },

  getRecentLogs: (): Promise<SimulationApiResponse[]> =>
    Promise.resolve(db.simLogs.getRecent()),
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
