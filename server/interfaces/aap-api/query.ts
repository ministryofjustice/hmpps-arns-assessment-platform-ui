import { User } from '../user';

export interface Query {
  type: string
  user: User
  assessmentUuid: string
}

export interface AssessmentVersionQuery extends Query {
  type: 'AssessmentVersionQuery'
  timestamp?: string // ISO date string
}

export interface AssessmentTimelineQuery extends Query {
  type: 'AssessmentTimelineQuery'
  timelineType?: string
  timestamp?: string
}

export interface CollectionQuery extends Query {
  type: 'CollectionQuery'
  timestamp?: string
  collectionUuid: string
  depth: number
}

export type Queries =
  | AssessmentVersionQuery
  | AssessmentTimelineQuery
  | CollectionQuery
