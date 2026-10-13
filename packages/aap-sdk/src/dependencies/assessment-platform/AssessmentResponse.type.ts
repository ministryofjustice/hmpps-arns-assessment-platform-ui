import { Commands } from './AssessmentCommand.type'
import { CommandResults } from './AssessmentCommandResult.type'
import { QueryResults } from './AssessmentQueryResult.type'
import { Queries } from './AssessmentQuery.type'

export interface CommandResponse {
  request: Commands
  result: CommandResults
}

export interface CommandsResponse {
  commands: CommandResponse[]
}

export interface QueryResponse {
  request: Queries
  result: QueryResults
}

export interface QueriesResponse {
  queries: QueryResponse[]
}
