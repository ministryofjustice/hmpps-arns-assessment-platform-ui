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
