import { User } from '../user'
import { Answers, Properties, PropertyKeys, QuestionCodes } from './dataModel'

interface CommandTimeline {
  type: string
  data: Record<string, any>
}

export interface Command {
  type: string
  timeline?: CommandTimeline
  user: User
  assessmentUuid: string
}

export interface CreateAssessmentCommand {
  type: 'CreateAssessmentCommand'
  formVersion: string
  properties: Properties
  timeline?: CommandTimeline
  user: User
}

export interface UpdateAssessmentAnswersCommand extends Command {
  type: 'UpdateAssessmentAnswersCommand'
  added: Answers
  removed: QuestionCodes
}

export interface RollBackAssessmentAnswersCommand extends Command {
  type: 'RollBackAssessmentAnswersCommand'
  pointInTime: string
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
  | RemoveCollectionItemCommand
  | ReorderCollectionItemCommand
  | RollBackAssessmentAnswersCommand
  | UpdateAssessmentAnswersCommand
  | UpdateAssessmentPropertiesCommand
  | UpdateCollectionItemAnswersCommand
  | UpdateCollectionItemPropertiesCommand
  | UpdateFormVersionCommand
