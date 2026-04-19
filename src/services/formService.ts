import { db } from '../store/memoryDb'
import type { SavedFormConfig, AlertFormMapping } from '../store/formConfigStore'

export interface FormConfigRequest {
  name: string
  description?: string
  fields: SavedFormConfig['fields']
}

export interface AlertFormMappingRequest {
  alertType: string
  sourceType: string
  formId: string
}

export const formService = {
  getAllForms: (): Promise<SavedFormConfig[]> =>
    Promise.resolve(db.formConfigs.getAll()),

  getFormById: (id: string): Promise<SavedFormConfig | undefined> =>
    Promise.resolve(db.formConfigs.getById(id)),

  createForm: (req: FormConfigRequest): Promise<SavedFormConfig> =>
    Promise.resolve(
      db.formConfigs.create({
        name: req.name,
        description: req.description || '',
        fields: req.fields,
      })
    ),

  updateForm: (id: string, req: FormConfigRequest): Promise<SavedFormConfig | undefined> =>
    Promise.resolve(db.formConfigs.update(id, req)),

  deleteForm: (id: string): Promise<void> => {
    db.formConfigs.delete(id)
    return Promise.resolve()
  },

  getAllMappings: (): Promise<AlertFormMapping[]> =>
    Promise.resolve(db.formMappings.getAll()),

  createMapping: (req: AlertFormMappingRequest): Promise<AlertFormMapping> =>
    Promise.resolve(db.formMappings.create(req)),

  deleteMapping: (id: string): Promise<void> => {
    db.formMappings.delete(id)
    return Promise.resolve()
  },

  resolveForm: (alertType: string, sourceType: string): Promise<SavedFormConfig | undefined> =>
    Promise.resolve(db.formMappings.resolve(alertType, sourceType)),
}
