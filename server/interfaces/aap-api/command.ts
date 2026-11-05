import { User } from '../user'
import { Answers, Properties, PropertyKeys, QuestionCodes } from './dataModel'
import { Identifiers } from './identifier'

interface CommandTimeline {
  type: string
  data: Record<string, any>
}

export interface Hook {
  type: string
}

export interface Command {
  type: string
  timeline?: CommandTimeline
  hooks?: Hook[]
  user: User
  assessmentUuid: string
}

export interface CreateAssessmentCommand {
  type: 'CreateAssessmentCommand'
  assessmentType: string
  identifiers?: Identifiers
  formVersion: string
  properties?: Properties
  flags?: string[]
  timeline?: CommandTimeline
  user: User
}

export interface CreateTimelineItemCommand extends Command {
  type: 'CreateTimelineItemCommand'
  timestamp: string
  timeline: CommandTimeline
}

export interface UpdateAssessmentAnswersCommand extends Command {
  type: 'UpdateAssessmentAnswersCommand'
  added: Answers
  removed: QuestionCodes
}

export interface RollbackCommand extends Command {
  type: 'RollbackCommand'
  pointInTime: string
}

export interface SoftDeleteCommand extends Command {
  type: 'SoftDeleteCommand'
  pointInTime: string
}

export interface UndeleteCommand extends Command {
  type: 'UndeleteCommand'
  pointInTime: string
}

export interface UpdateFlagsCommand extends Command {
  type: 'UpdateFlagsCommand'
  flags: string[]
}

export interface UpdateAssessmentPropertiesCommand extends Command {
  type: 'UpdateAssessmentPropertiesCommand'
  added: Properties
  removed: PropertyKeys
}

export interface UpdateFormVersionCommand extends Command {
  type: 'UpdateFormVersionCommand'
  version: string
}

export interface CreateCollectionCommand extends Command {
  type: 'CreateCollectionCommand'
  name: string
  parentCollectionItemUuid?: string
}

export interface AddCollectionItemCommand extends Command {
  type: 'AddCollectionItemCommand'
  collectionUuid: string
  answers: Answers
  properties: Properties
  index?: number
}

export interface UpdateCollectionItemAnswersCommand extends Command {
  type: 'UpdateCollectionItemAnswersCommand'
  collectionItemUuid: string
  added: Answers
  removed: QuestionCodes
}

export interface UpdateCollectionItemPropertiesCommand extends Command {
  type: 'UpdateCollectionItemPropertiesCommand'
  collectionItemUuid: string
  added: Properties
  removed: PropertyKeys
}

export interface RemoveCollectionItemCommand extends Command {
  type: 'RemoveCollectionItemCommand'
  collectionItemUuid: string
}

export interface ReorderCollectionItemCommand extends Command {
  type: 'ReorderCollectionItemCommand'
  collectionItemUuid: string
  index: number
}

export type Commands =
  | AddCollectionItemCommand
  | CreateAssessmentCommand
  | CreateCollectionCommand
  | CreateTimelineItemCommand
  | RemoveCollectionItemCommand
  | ReorderCollectionItemCommand
  | RollbackCommand
  | SoftDeleteCommand
  | UndeleteCommand
  | UpdateAssessmentAnswersCommand
  | UpdateAssessmentPropertiesCommand
  | UpdateCollectionItemAnswersCommand
  | UpdateCollectionItemPropertiesCommand
  | UpdateFlagsCommand
  | UpdateFormVersionCommand
