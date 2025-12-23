import { CommandResults } from '../../interfaces/aap-api/commandResult'

/**
 * Error thrown when an API command fails.
 * Provides access to the command type and result for custom error handling.
 *
 * @example
 * try {
 *   await deps.api.executeCommand({ type: 'AddCollectionItemCommand', ... })
 * } catch (error) {
 *   if (error instanceof CommandError) {
 *     // Handle specific failures
 *     throw new BadRequest(`Could not create goal: ${error.result?.message}`)
 *   }
 *   throw error
 * }
 */
export class CommandError extends Error {
  readonly name = 'CommandError'

  constructor(
    public readonly commandType: string,
    public readonly result: CommandResults | undefined,
    public readonly resultIndex?: number,
  ) {
    super(`${commandType} failed: ${result?.message ?? 'Unknown error'}`)
  }
}
