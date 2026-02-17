export type EntityType = 'ASSESSMENT' | 'AAP_PLAN'

export type VersionDetails = {
  uuid: string
  version: number
  createdAt: string
  updatedAt: string
  status: string
  planAgreementStatus: string | null
  entityType: EntityType
}

export interface LastVersionsOnDate {
  description: string
  assessmentVersion: VersionDetails
  planVersion: VersionDetails
}

export type VersionsTable = Record<string, LastVersionsOnDate>

export interface PreviousVersionsResponse {
  allVersions: VersionsTable
  countersignedVersions: VersionsTable
}
