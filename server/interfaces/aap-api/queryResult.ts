import { User } from '../user'
import { Answers, Collection, CollectionItem, Properties, TimelineItem } from './dataModel'
import { Identifiers } from './identifier'

export interface QueryResult {
  type: string
}

export interface AssessmentVersionQueryResult extends QueryResult {
  type: 'AssessmentVersionQueryResult'
  assessmentUuid: string
  aggregateUuid: string
  assessmentType: string
  formVersion: string
  createdAt: string
  updatedAt: string
  answers: Answers
  properties: Properties
  collections: Collection[]
  collaborators: User[]
  identifiers: Identifiers
}

export interface TimelineQueryResult extends QueryResult {
  type: 'TimelineQueryResult'
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

export type QueryResults =
  | AssessmentVersionQueryResult
  | TimelineQueryResult
  | CollectionQueryResult
  | CollectionItemQueryResult

/**
 * Maps query types to their corresponding result types.
 * Used by executeQuery to provide type-safe results.
 */
export interface QueryResultMap {
  AssessmentVersionQuery: AssessmentVersionQueryResult
  TimelineQuery: TimelineQueryResult
  CollectionQuery: CollectionQueryResult
  CollectionItemQuery: CollectionItemQueryResult
}

/**
 * Gets the result type for a given query type.
 * Falls back to QueryResult for unmapped queries.
 */
export type QueryResultFor<T extends { type: string }> = T['type'] extends keyof QueryResultMap
  ? QueryResultMap[T['type']]
  : QueryResult

/**
 * Maps a tuple of queries to a tuple of their corresponding result types.
 * Used by executeQueries for type-safe batch operations.
 */
export type QueryResultsFor<T extends readonly { type: string }[]> = {
  [K in keyof T]: T[K] extends { type: string } ? QueryResultFor<T[K]> : never
}
