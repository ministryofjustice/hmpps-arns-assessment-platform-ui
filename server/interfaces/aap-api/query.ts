import { User } from '../user'
import { AssessmentIdentifiers } from './identifier'

export interface Query {
  type: string
  user: User
  assessmentIdentifier: AssessmentIdentifiers
  timestamp?: string // ISO date string
}

export interface AssessmentVersionQuery extends Query {
  type: 'AssessmentVersionQuery'
}

export interface AssessmentTimelineQuery extends Query {
  type: 'AssessmentTimelineQuery'
  timelineTypes?: string[]
}

export interface CollectionQuery extends Query {
  type: 'CollectionQuery'
  collectionUuid: string
  depth: number
}

export interface CollectionItemQuery extends Query {
  type: 'CollectionItemQuery'
  collectionItemUuid: string
  depth: number
}

export type Queries = AssessmentVersionQuery | AssessmentTimelineQuery | CollectionQuery | CollectionItemQuery
