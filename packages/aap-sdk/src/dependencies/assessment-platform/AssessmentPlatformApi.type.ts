import type { Commands } from './AssessmentCommand.type'
import type { CommandResultFor, CommandResultsFor } from './AssessmentCommandResult.type'
import type { DataDeletionDataResponse, DataDeletionRequest, DataDeletionResponse } from './AssessmentDataDeletion.type'
import type { Queries } from './AssessmentQuery.type'
import type { AssessmentVersionQueryResult, QueryResultFor } from './AssessmentQueryResult.type'

export interface AssessmentCache {
  get(assessmentUuid: string): Promise<AssessmentVersionQueryResult | null>
}

export interface AssessmentPlatformApi {
  executeCommand<TCommand extends Commands>(command: TCommand): Promise<CommandResultFor<TCommand>>
  executeCommands<TCommands extends Commands[]>(...commands: TCommands): Promise<CommandResultsFor<TCommands>>
  executeQuery<TQuery extends Queries>(query: TQuery): Promise<QueryResultFor<TQuery>>
  getDataDeletionData(assessmentUuid: string): Promise<DataDeletionDataResponse>
  postDataDeletionRequest(assessmentUuid: string, request: DataDeletionRequest): Promise<DataDeletionResponse>
}

export interface AssessmentPlatformApiConnection {
  readonly apiUrl: string
  readonly authenticationUrl: string
  readonly clientId: string
  readonly clientSecret: string
}

export interface AssessmentPlatformApiFactory {
  create(connection: AssessmentPlatformApiConnection): AssessmentPlatformApi
}
