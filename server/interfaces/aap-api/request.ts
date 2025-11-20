import { Commands } from './command'
import { Queries } from './query'

export interface CommandsRequest {
  commands: Commands[]
}

export interface QueriesRequest {
  queries: Queries[]
}
