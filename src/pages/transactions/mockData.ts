export type TransactionStatus = 'Success' | 'Failed' | 'Pending'
export type Channel = 'Email' | 'SMS' | 'Push' | 'Webhook' | 'Slack'
export type InboundSource = 'Kafka' | 'REST API' | 'Batch Job' | 'Webhook' | 'Internal'
export type MessageKeyType = 'UOW_ID' | 'MESSAGE_ID' | 'CORRELATION_ID' | 'SESSION_ID' | 'TRANSACTION_ID'

export interface TransactionLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
}

export interface Transaction {
  id: string
  messageId: string
  alertName: string
  channel: Channel
  status: TransactionStatus
  createdTime: string
  processingTimeMs: number
  inboundSource: InboundSource
  messageKeyType: MessageKeyType
  messageValue: string
  templateUsed: string
  triggerSource: string
  deliveryStatus: string
  payload: Record<string, unknown>
  logs: TransactionLog[]
}

const alertNames = [
  'Payment Confirmation',
  'Fraud Detection Alert',
  'Low Balance Warning',
  'Account Login Notification',
  'Subscription Renewal',
  'Order Shipped',
  'Password Reset',
  'SLA Breach Warning',
  'System Maintenance',
  'Transfer Completed',
]

const templateNames = [
  'payment-confirm-v2',
  'fraud-alert-template',
  'low-balance-notify',
  'login-security-v1',
  'subscription-remind',
  'order-update-v3',
  'password-reset-v1',
  'sla-alert-template',
  'maintenance-notify',
  'transfer-complete-v2',
]

const channels: Channel[] = ['Email', 'SMS', 'Push', 'Webhook', 'Slack']
const sources: InboundSource[] = ['Kafka', 'REST API', 'Batch Job', 'Webhook', 'Internal']
const keyTypes: MessageKeyType[] = ['UOW_ID', 'MESSAGE_ID', 'CORRELATION_ID', 'SESSION_ID', 'TRANSACTION_ID']
const statuses: TransactionStatus[] = ['Success', 'Success', 'Success', 'Failed', 'Pending']

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
}

function generateDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  d.setHours(Math.floor(Math.random() * 24))
  d.setMinutes(Math.floor(Math.random() * 60))
  d.setSeconds(Math.floor(Math.random() * 60))
  return d.toISOString()
}

function generateLogs(status: TransactionStatus): TransactionLog[] {
  const base: TransactionLog[] = [
    { timestamp: new Date(Date.now() - 5000).toISOString(), level: 'INFO', message: 'Message received from inbound source' },
    { timestamp: new Date(Date.now() - 4500).toISOString(), level: 'DEBUG', message: 'Payload deserialized successfully' },
    { timestamp: new Date(Date.now() - 4000).toISOString(), level: 'INFO', message: 'Template resolved and rendering started' },
    { timestamp: new Date(Date.now() - 3000).toISOString(), level: 'INFO', message: 'Delivery channel initialized' },
  ]

  if (status === 'Success') {
    base.push({ timestamp: new Date(Date.now() - 1000).toISOString(), level: 'INFO', message: 'Message delivered successfully' })
    base.push({ timestamp: new Date().toISOString(), level: 'INFO', message: 'Delivery confirmed by provider' })
  } else if (status === 'Failed') {
    base.push({ timestamp: new Date(Date.now() - 2000).toISOString(), level: 'WARN', message: 'Retry attempt 1/3 initiated' })
    base.push({ timestamp: new Date(Date.now() - 1500).toISOString(), level: 'ERROR', message: 'Delivery failed: Connection timeout' })
    base.push({ timestamp: new Date().toISOString(), level: 'ERROR', message: 'Max retries exceeded, marking as failed' })
  } else {
    base.push({ timestamp: new Date().toISOString(), level: 'INFO', message: 'Message queued, awaiting delivery slot' })
  }

  return base
}

function generateTransaction(index: number): Transaction {
  const alertIdx = index % alertNames.length
  const status = randomFrom(statuses)
  const channel = randomFrom(channels)
  const source = randomFrom(sources)
  const keyType = randomFrom(keyTypes)

  return {
    id: generateId('TXN'),
    messageId: generateId('MSG'),
    alertName: alertNames[alertIdx],
    channel,
    status,
    createdTime: generateDate(30),
    processingTimeMs: Math.floor(Math.random() * 4800) + 120,
    inboundSource: source,
    messageKeyType: keyType,
    messageValue: generateId(keyType.substring(0, 3)),
    templateUsed: templateNames[alertIdx],
    triggerSource: source,
    deliveryStatus: status === 'Success' ? 'Delivered' : status === 'Failed' ? 'Undeliverable' : 'Queued',
    payload: {
      userId: `USR-${Math.floor(Math.random() * 99999)}`,
      accountId: `ACC-${Math.floor(Math.random() * 99999)}`,
      eventType: alertNames[alertIdx].toLowerCase().replace(/ /g, '_'),
      amount: status !== 'Pending' ? (Math.random() * 9000 + 100).toFixed(2) : undefined,
      currency: 'USD',
      timestamp: generateDate(1),
      metadata: {
        correlationId: generateId('COR'),
        priority: randomFrom(['HIGH', 'MEDIUM', 'LOW']),
        retryCount: status === 'Failed' ? 3 : 0,
      },
    },
    logs: generateLogs(status),
  }
}

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 87 }, (_, i) => generateTransaction(i))
  .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())

export const INBOUND_SOURCES: InboundSource[] = ['Kafka', 'REST API', 'Batch Job', 'Webhook', 'Internal']
export const MESSAGE_KEY_TYPES: MessageKeyType[] = ['UOW_ID', 'MESSAGE_ID', 'CORRELATION_ID', 'SESSION_ID', 'TRANSACTION_ID']
export const CHANNELS: Channel[] = ['Email', 'SMS', 'Push', 'Webhook', 'Slack']
