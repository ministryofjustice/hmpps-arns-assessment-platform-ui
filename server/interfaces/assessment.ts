import { User } from './user'

/**
 * CQRS Command and Query types for the Assessment Platform API.
 * These types define the structure of requests and responses for the CQRS-based API.
 */

// Commands

export interface CreateAssessmentCommand {
  type: 'CreateAssessmentCommand'
  user: User
}

export interface CommandsRequest extends Record<string, unknown> {
  commands: CreateAssessmentCommand[]
}

export interface CreateAssessmentCommandResult {
  assessmentUuid: string
  message: string
  success: boolean
}

export interface CommandResponse {
  request: CreateAssessmentCommand
  result: CreateAssessmentCommandResult
}

export interface CommandsResponse {
  commands: CommandResponse[]
}

// Queries

export interface AssessmentVersionQuery {
  type: 'AssessmentVersionQuery'
  user: User
  assessmentUuid: string
  timestamp?: string // ISO date string
}

export interface QueriesRequest extends Record<string, unknown> {
  queries: AssessmentVersionQuery[]
}

export interface AssessmentVersionQueryResult {
  answers: Record<string, string[]>
  collaborators: User[]
  formVersion: string
}

export interface QueryResponse {
  request: AssessmentVersionQuery
  result: AssessmentVersionQueryResult
}

export interface QueriesResponse {
  queries: QueryResponse[]
}
