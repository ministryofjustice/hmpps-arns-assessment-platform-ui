import { CommandResponse } from './response'

export interface CommandResult {
  message: string
  success: boolean
  type: string
}

export interface GroupCommandResult extends CommandResult {
  type: 'GroupCommandResult'
  commands: CommandResponse[]
}

export interface CreateAssessmentCommandResult extends CommandResult {
  type: 'CreateAssessmentCommandResult'
  assessmentUuid: string
}

export interface CreateCollectionCommandResult extends CommandResult {
  type: 'CreateCollectionCommandResult'
  collectionUuid: string
}

export interface AddCollectionItemCommandResult extends CommandResult {
  type: 'AddCollectionItemCommandResult'
  collectionItemUuid: string
}

export type CommandResults =
  | CommandResult
  | CreateAssessmentCommandResult
  | CreateCollectionCommandResult
  | AddCollectionItemCommandResult
  | GroupCommandResult

/**
 * Maps command types to their corresponding result types.
 * Used by executeCommand to provide type-safe results.
 */
export interface CommandResultMap {
  CreateAssessmentCommand: CreateAssessmentCommandResult
  CreateCollectionCommand: CreateCollectionCommandResult
  AddCollectionItemCommand: AddCollectionItemCommandResult
  GroupCommand: GroupCommandResult
}

/**
 * Gets the result type for a given command type.
 * Falls back to CommandResult for unmapped commands.
 */
export type CommandResultFor<T extends { type: string }> = T['type'] extends keyof CommandResultMap
  ? CommandResultMap[T['type']]
  : CommandResult

/**
 * Maps a tuple of commands to a tuple of their corresponding result types.
 * Used by executeCommandBatch for type-safe batch operations.
 */
export type CommandResultsFor<T extends readonly { type: string }[]> = {
  [K in keyof T]: T[K] extends { type: string } ? CommandResultFor<T[K]> : never
}
