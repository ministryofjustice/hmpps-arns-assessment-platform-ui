import { Commands } from './command';
import { CommandResults } from './commandResult';
import { QueryResults } from './queryResult';
import { Queries } from './query';

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
