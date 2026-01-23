export enum IdentifierType {
  CRN = 'CRN',
  NOMIS = 'NOMIS',
}

export type Identifiers = {
  [K in IdentifierType]?: string
}

export interface AssessmentIdentifier {
  type: string
}

export interface UuidIdentifier extends AssessmentIdentifier {
  type: 'UUID'
  uuid: string
}

export interface ExternalIdentifier extends AssessmentIdentifier {
  type: 'EXTERNAL'
  identifier: string
  identifierType: IdentifierType | keyof typeof IdentifierType | string
  assessmentType: string
}

export type AssessmentIdentifiers = UuidIdentifier | ExternalIdentifier
