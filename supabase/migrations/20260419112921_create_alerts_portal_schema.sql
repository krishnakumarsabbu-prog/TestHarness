/*
  # Alerts Portal Database Schema

  ## Overview
  Creates the complete database schema for the Alerts Management Portal.

  ## New Tables

  ### 1. alert_templates
  Stores alert notification templates with channel, language, and version support.
  - id: UUID primary key
  - name: Template identifier name
  - channel: Delivery channel (Email, SMS, Push, Inbox)
  - language: Template language (English, Spanish, etc.)
  - version: Template version year
  - subject: Email subject line with variable placeholders
  - body: Template body text with variable placeholders
  - html_template: Full HTML email template
  - variables: JSON array of variable names used in template
  - status: active/inactive/draft
  - metadata: Additional JSON metadata

  ### 2. transactions
  Logs all alert processing events and delivery attempts.
  - id: UUID primary key
  - message_id: Unique message identifier
  - alert_name: Name of the alert type
  - channel: Delivery channel used
  - status: Success/Failed/Pending
  - created_time: When the transaction was initiated
  - processing_time_ms: Time taken to process in milliseconds
  - inbound_source: Where the message originated
  - message_key_type: Type of message key used
  - message_value: Value of the message key
  - template_used: Which template was applied
  - trigger_source: What triggered the alert
  - delivery_status: Final delivery outcome
  - payload: Full JSON payload of the message
  - logs: JSON array of processing log entries

  ### 3. form_configs
  Dynamic form configurations for alert onboarding.
  - id: UUID primary key
  - name: Form configuration name
  - description: Form description
  - fields: JSON array of form field definitions
  - created_at / updated_at: Timestamps

  ### 4. alert_form_mappings
  Maps alert types + source types to specific form configurations.
  - id: UUID primary key
  - alert_type: Alert type identifier
  - source_type: Source type (Kafka, MQ, WebService, Batch)
  - form_id: Foreign key to form_configs

  ### 5. simulation_scenarios
  Saved message simulation scenarios for the Message Simulator.
  - id: UUID primary key
  - name: Scenario name
  - description: Optional description
  - channel: Kafka/MQ/WebService
  - config: JSON channel configuration
  - payload: Message payload text

  ### 6. simulation_logs
  Records of simulation runs for auditing and debugging.
  - id: UUID primary key
  - scenario_id: Optional reference to scenario
  - channel: Channel simulated
  - config: Configuration used
  - payload: Payload sent
  - status: success/failure
  - http_status: HTTP status code if applicable
  - response_time_ms: Simulated response time
  - message: Response message
  - logs: JSON array of log entries

  ### 7. batch_jobs
  Batch processing job definitions and history.
  - id: UUID primary key
  - name: Job name
  - type: Job type
  - status: pending/running/completed/failed
  - config: JSON job configuration
  - result: JSON result data
  - started_at / completed_at: Job timing

  ## Security
  - RLS enabled on all tables
  - Policies allow public access (no authentication required for this portal)
  - Note: In production, these should be restricted to authenticated users
*/

-- Alert Templates
CREATE TABLE IF NOT EXISTS alert_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel text NOT NULL,
  language text NOT NULL DEFAULT 'English',
  version text NOT NULL,
  subject text DEFAULT '',
  body text DEFAULT '',
  html_template text DEFAULT '',
  variables jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE alert_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read alert_templates"
  ON alert_templates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert alert_templates"
  ON alert_templates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update alert_templates"
  ON alert_templates FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete alert_templates"
  ON alert_templates FOR DELETE
  TO anon, authenticated
  USING (true);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text NOT NULL,
  alert_name text NOT NULL,
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_time timestamptz DEFAULT now(),
  processing_time_ms integer DEFAULT 0,
  inbound_source text NOT NULL DEFAULT '',
  message_key_type text NOT NULL DEFAULT '',
  message_value text NOT NULL DEFAULT '',
  template_used text NOT NULL DEFAULT '',
  trigger_source text NOT NULL DEFAULT '',
  delivery_status text NOT NULL DEFAULT '',
  payload jsonb DEFAULT '{}'::jsonb,
  logs jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read transactions"
  ON transactions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert transactions"
  ON transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update transactions"
  ON transactions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete transactions"
  ON transactions FOR DELETE
  TO anon, authenticated
  USING (true);

-- Form Configurations
CREATE TABLE IF NOT EXISTS form_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  fields jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE form_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read form_configs"
  ON form_configs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert form_configs"
  ON form_configs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update form_configs"
  ON form_configs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete form_configs"
  ON form_configs FOR DELETE
  TO anon, authenticated
  USING (true);

-- Alert Form Mappings
CREATE TABLE IF NOT EXISTS alert_form_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  source_type text NOT NULL,
  form_id uuid REFERENCES form_configs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(alert_type, source_type)
);

ALTER TABLE alert_form_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read alert_form_mappings"
  ON alert_form_mappings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert alert_form_mappings"
  ON alert_form_mappings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update alert_form_mappings"
  ON alert_form_mappings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete alert_form_mappings"
  ON alert_form_mappings FOR DELETE
  TO anon, authenticated
  USING (true);

-- Simulation Scenarios
CREATE TABLE IF NOT EXISTS simulation_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  channel text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  payload text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE simulation_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read simulation_scenarios"
  ON simulation_scenarios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert simulation_scenarios"
  ON simulation_scenarios FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update simulation_scenarios"
  ON simulation_scenarios FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete simulation_scenarios"
  ON simulation_scenarios FOR DELETE
  TO anon, authenticated
  USING (true);

-- Simulation Logs
CREATE TABLE IF NOT EXISTS simulation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES simulation_scenarios(id) ON DELETE SET NULL,
  channel text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  payload text DEFAULT '',
  status text NOT NULL DEFAULT 'success',
  http_status integer,
  response_time_ms integer DEFAULT 0,
  message text DEFAULT '',
  logs jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE simulation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read simulation_logs"
  ON simulation_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert simulation_logs"
  ON simulation_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update simulation_logs"
  ON simulation_logs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete simulation_logs"
  ON simulation_logs FOR DELETE
  TO anon, authenticated
  USING (true);

-- Batch Jobs
CREATE TABLE IF NOT EXISTS batch_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'standard',
  status text NOT NULL DEFAULT 'pending',
  config jsonb DEFAULT '{}'::jsonb,
  result jsonb DEFAULT '{}'::jsonb,
  error_message text DEFAULT '',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read batch_jobs"
  ON batch_jobs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert batch_jobs"
  ON batch_jobs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update batch_jobs"
  ON batch_jobs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete batch_jobs"
  ON batch_jobs FOR DELETE
  TO anon, authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_channel ON transactions(channel);
CREATE INDEX IF NOT EXISTS idx_transactions_created_time ON transactions(created_time DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_inbound_source ON transactions(inbound_source);
CREATE INDEX IF NOT EXISTS idx_transactions_message_key_type ON transactions(message_key_type);
CREATE INDEX IF NOT EXISTS idx_alert_templates_name ON alert_templates(name);
CREATE INDEX IF NOT EXISTS idx_alert_templates_channel ON alert_templates(channel);
CREATE INDEX IF NOT EXISTS idx_simulation_logs_created_at ON simulation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON batch_jobs(status);
