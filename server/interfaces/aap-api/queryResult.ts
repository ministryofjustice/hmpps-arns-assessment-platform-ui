import { User } from '../user'
import { Answers, Collection, CollectionItem, Properties, TimelineItem } from './dataModel'

export interface QueryResult {
  type: string
}

export interface AssessmentVersionQueryResult extends QueryResult {
  type: 'AssessmentVersionQueryResult'
  assessmentUuid: string
  aggregateUuid: string
  formVersion?: string
  createdAt: string
  updatedAt: string
  answers: Answers
  properties: Properties
  collections: Collection[]
  collaborators: User[]
}

export interface AssessmentTimelineQueryResult extends QueryResult {
  type: 'AssessmentTimelineQueryResult'
  timeline: TimelineItem[]
}

export interface CollectionQueryResult extends QueryResult {
  type: 'CollectionQueryResult'
  collection: Collection
}

export interface CollectionItemQueryResult extends QueryResult {
  type: 'CollectionItemQueryResult'
  collectionItem: CollectionItem
}

export type QueryResults = AssessmentVersionQueryResult | AssessmentTimelineQueryResult | CollectionQueryResult
