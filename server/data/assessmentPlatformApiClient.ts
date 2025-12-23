import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { CommandsRequest, QueriesRequest } from '../interfaces/aap-api/request'
import { CommandsResponse, QueriesResponse } from '../interfaces/aap-api/response'
import { Commands } from '../interfaces/aap-api/command'
import { Queries } from '../interfaces/aap-api/query'
import { CommandResultFor, CommandResultsFor } from '../interfaces/aap-api/commandResult'
import { QueryResultFor, QueryResultsFor } from '../interfaces/aap-api/queryResult'
import { CommandError } from '../errors/aap-api/CommandError'
import { QueryError } from '../errors/aap-api/QueryError'

export default class AssessmentPlatformApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Assessment Platform API', config.apis.aapApi, logger, authenticationClient)
  }

  /**
   * Execute a single command and return the typed result.
   * Throws if the command fails.
   */
  async executeCommand<T extends Commands>(command: T): Promise<CommandResultFor<T>> {
    const [result] = await this.executeCommands(command)
    return result
  }

  /**
   * Execute multiple commands as a batch and return typed results.
   * All commands succeed or fail together (transactional).
   * Throws if any command fails.
   *
   * @example
   * const [collectionResult, itemResult] = await api.executeCommands(
   *   { type: 'CreateCollectionCommand', ... },
   *   { type: 'AddCollectionItemCommand', ... },
   * )
   */
  async executeCommands<T extends Commands[]>(...commands: T): Promise<CommandResultsFor<T>> {
    const response = await this.executeCommandsRaw({ commands })

    response.commands.forEach((cmd, i) => {
      if (!cmd.result?.success) {
        throw new CommandError(commands[i].type, cmd.result, i)
      }
    })

    return response.commands.map(c => c.result) as CommandResultsFor<T>
  }

  /**
   * Execute a single query and return the typed result.
   * Throws if the query fails (no result returned).
   */
  async executeQuery<T extends Queries>(query: T): Promise<QueryResultFor<T>> {
    const [result] = await this.executeQueries(query)
    return result
  }

  /**
   * Execute multiple queries and return typed results.
   * Throws if any query fails.
   *
   * @example
   * const [assessmentResult, timelineResult] = await api.executeQueries(
   *   { type: 'AssessmentVersionQuery', ... },
   *   { type: 'AssessmentTimelineQuery', ... },
   * )
   */
  async executeQueries<T extends Queries[]>(...queries: T): Promise<QueryResultsFor<T>> {
    const response = await this.executeQueriesRaw({ queries })

    response.queries.forEach((q, i) => {
      if (!q.result) {
        throw new QueryError(queries[i].type, q.result, i)
      }
    })

    return response.queries.map(q => q.result) as QueryResultsFor<T>
  }

  // Raw CQRS endpoints - used internally
  private async executeCommandsRaw(request: CommandsRequest): Promise<CommandsResponse> {
    return this.post({ path: '/command', data: request as unknown as Record<string, unknown> }, asSystem())
  }

  private async executeQueriesRaw(request: QueriesRequest): Promise<QueriesResponse> {
    return this.post({ path: '/query', data: request as unknown as Record<string, unknown> }, asSystem())
  }
}
