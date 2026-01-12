import { QueryResults } from '../../interfaces/aap-api/queryResult'

/**
 * Error thrown when an API query fails.
 * Provides access to the query type and result for custom error handling.
 *
 * @example
 * try {
 *   await deps.api.executeQuery({ type: 'AssessmentVersionQuery', ... })
 * } catch (error) {
 *   if (error instanceof QueryError) {
 *     // Handle specific failures
 *     throw new NotFound(`Assessment not found`)
 *   }
 *   throw error
 * }
 */
export class QueryError extends Error {
  readonly name = 'QueryError'

  constructor(
    public readonly queryType: string,
    public readonly result: QueryResults | undefined,
    public readonly resultIndex?: number,
  ) {
    super(`${queryType} failed: ${result ?? 'No result returned'}`)
  }
}
