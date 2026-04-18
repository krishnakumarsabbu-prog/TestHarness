import type { Environment, Scenario } from './types'

export const ENVIRONMENTS: Environment[] = [
  { id: 'dev', label: 'Development', url: 'kafka-dev.internal:9092' },
  { id: 'qa', label: 'QA', url: 'kafka-qa.internal:9092' },
  { id: 'staging', label: 'Staging', url: 'kafka-staging.internal:9092' },
  { id: 'prod', label: 'Production', url: 'kafka-prod.internal:9092' },
]

export const KAFKA_TOPICS = [
  'payments.inbound',
  'payments.outbound',
  'transactions.created',
  'transactions.updated',
  'alerts.triggered',
  'fraud.detection',
  'account.events',
  'notifications.send',
]

export const MQ_QUEUES = [
  'PAYMENTS.REQUEST',
  'PAYMENTS.RESPONSE',
  'TRANSACTION.INBOUND',
  'ALERT.NOTIFY',
  'BATCH.PROCESSOR',
  'DLQ.PAYMENTS',
  'DLQ.TRANSACTIONS',
]

export const WEB_SERVICES = [
  { id: 'payment-svc', label: 'Payment Service', endpoint: '/api/v1/payments' },
  { id: 'transaction-svc', label: 'Transaction Service', endpoint: '/api/v1/transactions' },
  { id: 'alert-svc', label: 'Alert Service', endpoint: '/api/v1/alerts' },
  { id: 'account-svc', label: 'Account Service', endpoint: '/api/v1/accounts' },
  { id: 'fraud-svc', label: 'Fraud Detection Service', endpoint: '/api/v1/fraud/check' },
]

export const DEFAULT_KAFKA_PAYLOAD = `{
  "messageId": "msg-001",
  "timestamp": "2026-04-18T10:00:00Z",
  "source": "payment-gateway",
  "version": "1.0",
  "data": {
    "transactionId": "txn-abc123",
    "amount": 250.00,
    "currency": "USD",
    "accountId": "acc-9876",
    "merchantId": "merchant-001",
    "status": "PENDING"
  },
  "metadata": {
    "correlationId": "corr-xyz789",
    "retryCount": 0
  }
}`

export const DEFAULT_MQ_PAYLOAD = `<?xml version="1.0" encoding="UTF-8"?>
<Message xmlns="http://payments.internal/schema/v1">
  <Header>
    <MessageId>msg-001</MessageId>
    <Timestamp>2026-04-18T10:00:00Z</Timestamp>
    <Source>payment-gateway</Source>
    <Version>1.0</Version>
    <CorrelationId>corr-xyz789</CorrelationId>
  </Header>
  <Body>
    <Transaction>
      <TransactionId>txn-abc123</TransactionId>
      <Amount>250.00</Amount>
      <Currency>USD</Currency>
      <AccountId>acc-9876</AccountId>
      <Status>PENDING</Status>
    </Transaction>
  </Body>
</Message>`

export const DEFAULT_WS_PAYLOAD = `{
  "transactionId": "txn-abc123",
  "amount": 250.00,
  "currency": "USD",
  "accountId": "acc-9876",
  "merchantId": "merchant-001",
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0",
    "sessionId": "session-abc"
  }
}`

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    name: 'Payment Created - Kafka',
    description: 'Standard payment creation event via Kafka',
    channel: 'kafka',
    config: {
      environment: 'dev',
      format: 'json',
      kafka: { topic: 'payments.inbound', partition: 0, key: 'acc-9876' },
    },
    payload: DEFAULT_KAFKA_PAYLOAD,
    createdAt: '2026-04-15T08:00:00Z',
  },
  {
    id: 'sc-2',
    name: 'Transaction Request - MQ',
    description: 'XML transaction request via IBM MQ',
    channel: 'mq',
    config: {
      environment: 'qa',
      format: 'xml',
      mq: { queue: 'TRANSACTION.INBOUND', correlationId: 'corr-xyz789' },
    },
    payload: DEFAULT_MQ_PAYLOAD,
    createdAt: '2026-04-16T09:30:00Z',
  },
  {
    id: 'sc-3',
    name: 'Fraud Check - REST',
    description: 'POST request to fraud detection service',
    channel: 'webservice',
    config: {
      environment: 'staging',
      format: 'json',
      webservice: { service: 'fraud-svc', method: 'POST', endpoint: '/api/v1/fraud/check' },
    },
    payload: DEFAULT_WS_PAYLOAD,
    createdAt: '2026-04-17T14:00:00Z',
  },
]
