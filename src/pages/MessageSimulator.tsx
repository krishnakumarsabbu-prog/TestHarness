import { useState, useCallback, useEffect } from 'react'
import { PageContainer, SectionCard, Tabs, Button, useToast } from '../components/ui'
import ChannelConfigPanel from './message-simulator/ChannelConfig'
import PayloadEditor from './message-simulator/PayloadEditor'
import ResponsePanel from './message-simulator/ResponsePanel'
import ScenarioPanel from './message-simulator/ScenarioPanel'
import { simulateSend } from './message-simulator/mockSimulate'
import { simulationService, toSimulationResponse } from '../services/simulationService'
import {
  DEFAULT_KAFKA_PAYLOAD,
  DEFAULT_MQ_PAYLOAD,
  DEFAULT_WS_PAYLOAD,
  INITIAL_SCENARIOS,
  KAFKA_TOPICS,
  MQ_QUEUES,
  WEB_SERVICES,
} from './message-simulator/mockData'
import type {
  ChannelType,
  ChannelConfig,
  SimulationResponse,
  Scenario,
} from './message-simulator/types'

const DEFAULT_CONFIGS: Record<ChannelType, ChannelConfig> = {
  kafka: {
    environment: 'dev',
    format: 'json',
    kafka: { topic: KAFKA_TOPICS[0], partition: 0 },
  },
  mq: {
    environment: 'dev',
    format: 'xml',
    mq: { queue: MQ_QUEUES[0] },
  },
  webservice: {
    environment: 'dev',
    format: 'json',
    webservice: {
      service: WEB_SERVICES[0].id,
      method: 'POST',
      endpoint: WEB_SERVICES[0].endpoint,
    },
  },
}

const DEFAULT_PAYLOADS: Record<ChannelType, string> = {
  kafka: DEFAULT_KAFKA_PAYLOAD,
  mq: DEFAULT_MQ_PAYLOAD,
  webservice: DEFAULT_WS_PAYLOAD,
}

const IDLE_RESPONSE: SimulationResponse = { status: 'idle', logs: [] }

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  )
}

function KafkaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  )
}

function MQIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  )
}

function WSIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  )
}

interface ChannelPanelProps {
  channel: ChannelType
  config: ChannelConfig
  payload: string
  onConfigChange: (c: ChannelConfig) => void
  onPayloadChange: (p: string) => void
  onSend: () => void
  response: SimulationResponse
  sending: boolean
}

function ChannelPanel({
  channel,
  config,
  payload,
  onConfigChange,
  onPayloadChange,
  onSend,
  response,
  sending,
}: ChannelPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard>
        <div className="flex flex-col gap-5">
          <ChannelConfigPanel channel={channel} config={config} onChange={onConfigChange} />
          <div className="border-t border-surface-100" />
          <PayloadEditor value={payload} onChange={onPayloadChange} format={config.format} />
          <div className="flex items-center justify-end pt-2">
            <Button
              onClick={onSend}
              loading={sending}
              size="md"
              icon={!sending ? <SendIcon /> : undefined}
            >
              Send Message
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Response">
        <ResponsePanel response={response} />
      </SectionCard>
    </div>
  )
}

function MessageSimulator() {
  const { toast } = useToast()

  const [activeChannel, setActiveChannel] = useState<ChannelType>('kafka')
  const [configs, setConfigs] = useState<Record<ChannelType, ChannelConfig>>({ ...DEFAULT_CONFIGS })
  const [payloads, setPayloads] = useState<Record<ChannelType, string>>({ ...DEFAULT_PAYLOADS })
  const [responses, setResponses] = useState<Record<ChannelType, SimulationResponse>>({
    kafka: { ...IDLE_RESPONSE },
    mq: { ...IDLE_RESPONSE },
    webservice: { ...IDLE_RESPONSE },
  })
  const [sending, setSending] = useState<Record<ChannelType, boolean>>({
    kafka: false,
    mq: false,
    webservice: false,
  })
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS)

  useEffect(() => {
    simulationService.getAllScenarios()
      .then((s) => { if (s.length > 0) setScenarios(s) })
      .catch(() => {})
  }, [])

  const handleConfigChange = useCallback(
    (channel: ChannelType) => (config: ChannelConfig) => {
      setConfigs((prev) => ({ ...prev, [channel]: config }))
    },
    []
  )

  const handlePayloadChange = useCallback(
    (channel: ChannelType) => (payload: string) => {
      setPayloads((prev) => ({ ...prev, [channel]: payload }))
    },
    []
  )

  const handleSend = useCallback(
    (channel: ChannelType) => async () => {
      setSending((prev) => ({ ...prev, [channel]: true }))
      setResponses((prev) => ({ ...prev, [channel]: { status: 'sending', logs: [] } }))
      try {
        let result: SimulationResponse
        try {
          const apiRes = await simulationService.send({ channel, config: configs[channel], payload: payloads[channel] })
          result = toSimulationResponse(apiRes)
        } catch {
          result = await simulateSend({ channel, config: configs[channel], payload: payloads[channel] })
        }
        setResponses((prev) => ({ ...prev, [channel]: result }))
        if (result.status === 'success') {
          toast({ type: 'success', title: 'Message sent', message: result.message })
        } else {
          toast({ type: 'error', title: 'Send failed', message: result.message })
        }
      } finally {
        setSending((prev) => ({ ...prev, [channel]: false }))
      }
    },
    [configs, payloads, toast]
  )

  const handleSaveScenario = useCallback(
    (name: string, description: string) => {
      const scenario: Scenario = {
        id: `sc-${Date.now()}`,
        name,
        description,
        channel: activeChannel,
        config: configs[activeChannel],
        payload: payloads[activeChannel],
        createdAt: new Date().toISOString(),
      }
      setScenarios((prev) => [scenario, ...prev])
      toast({ type: 'success', title: 'Scenario saved', message: `"${name}" saved successfully` })
    },
    [activeChannel, configs, payloads, toast]
  )

  const handleLoadScenario = useCallback(
    (scenario: Scenario) => {
      setActiveChannel(scenario.channel)
      setConfigs((prev) => ({ ...prev, [scenario.channel]: scenario.config }))
      setPayloads((prev) => ({ ...prev, [scenario.channel]: scenario.payload }))
      toast({ type: 'success', title: 'Scenario loaded', message: `"${scenario.name}" loaded` })
    },
    [toast]
  )

  const handleDeleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const tabs = [
    {
      id: 'kafka',
      label: 'Kafka',
      icon: <KafkaIcon />,
      content: (
        <ChannelPanel
          channel="kafka"
          config={configs.kafka}
          payload={payloads.kafka}
          onConfigChange={handleConfigChange('kafka')}
          onPayloadChange={handlePayloadChange('kafka')}
          onSend={handleSend('kafka')}
          response={responses.kafka}
          sending={sending.kafka}
        />
      ),
    },
    {
      id: 'mq',
      label: 'MQ',
      icon: <MQIcon />,
      content: (
        <ChannelPanel
          channel="mq"
          config={configs.mq}
          payload={payloads.mq}
          onConfigChange={handleConfigChange('mq')}
          onPayloadChange={handlePayloadChange('mq')}
          onSend={handleSend('mq')}
          response={responses.mq}
          sending={sending.mq}
        />
      ),
    },
    {
      id: 'webservice',
      label: 'Web Service',
      icon: <WSIcon />,
      content: (
        <ChannelPanel
          channel="webservice"
          config={configs.webservice}
          payload={payloads.webservice}
          onConfigChange={handleConfigChange('webservice')}
          onPayloadChange={handlePayloadChange('webservice')}
          onSend={handleSend('webservice')}
          response={responses.webservice}
          sending={sending.webservice}
        />
      ),
    },
  ]

  return (
    <PageContainer
      title="Message Simulator"
      subtitle="Simulate inbound messages across Kafka, MQ, and Web Service channels"
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="min-w-0">
          <SectionCard>
            <Tabs
              tabs={tabs}
              defaultTab="kafka"
              onChange={(id) => setActiveChannel(id as ChannelType)}
              variant="underline"
            />
          </SectionCard>
        </div>

        <div className="xl:sticky xl:top-6">
          <SectionCard>
            <ScenarioPanel
              scenarios={scenarios}
              onLoad={handleLoadScenario}
              onDelete={handleDeleteScenario}
              currentChannel={activeChannel}
              onSave={handleSaveScenario}
            />
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  )
}

export default MessageSimulator
