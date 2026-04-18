export type FieldType = 'Text' | 'Number' | 'Boolean' | 'Dropdown' | 'JSON'
export type SourceType = 'Kafka' | 'MQ' | 'WebService' | 'Batch'

export interface AlertField {
  id: string
  fieldName: string
  fieldType: FieldType
  required: boolean
  defaultValue: string
  dropdownValues: string
}

export interface AlertMetadataValues {
  alertName: string
  alertType: string
  sourceType: string
  version: string
  description: string
}

export interface AlertConfig {
  metadata: AlertMetadataValues
  fields: AlertField[]
}
