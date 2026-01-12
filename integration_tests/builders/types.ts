import { Answers, Properties } from '../../server/interfaces/aap-api/dataModel'

/**
 * Definition types - built during fluent API calls, before execution
 */

export interface AssessmentDefinition {
  assessmentType: string
  formVersion: string
  identifiers: Record<string, string>
  answers: Answers
  properties: Properties
  collections: CollectionDefinition[]
}

export interface CollectionDefinition {
  name: string
  items: CollectionItemDefinition[]
}

export interface CollectionItemDefinition {
  answers: Answers
  properties: Properties
  collections: CollectionDefinition[]
}

export interface CreatedAssessment {
  uuid: string
  collections: CreatedCollection[]
}

export interface CreatedCollection {
  name: string
  uuid: string
  items: CreatedCollectionItem[]
}

export interface CreatedCollectionItem {
  uuid: string
  collections: CreatedCollection[]
}
