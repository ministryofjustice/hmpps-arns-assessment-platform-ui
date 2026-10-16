import { Commands } from './AssessmentCommand.type'
import { Queries } from './AssessmentQuery.type'

export interface CommandsRequest {
  commands: Commands[]
}

export interface QueriesRequest {
  queries: Queries[]
}
