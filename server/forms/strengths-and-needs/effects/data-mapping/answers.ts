/**
 * Port of the subset of persistence/entity/AssessmentVersion.kt's data shapes
 * that the data mapping code depends on: the persisted answers for an
 * assessment version, and the OasysEquivalent output shape.
 */

export enum AnswerType {
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  COLLECTION = 'COLLECTION',
  DATE = 'DATE',
}

export interface AnswerOption {
  value: string
  text: string
}

export interface PersistedAnswer {
  type: AnswerType
  description: string
  options?: AnswerOption[] | null
  value?: string | null
  values?: string[] | null
  collection?: Answers[] | null
}

export type Answers = Record<string, PersistedAnswer>

export type OasysEquivalent = Record<string, unknown>
