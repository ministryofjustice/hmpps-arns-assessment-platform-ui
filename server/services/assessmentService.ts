import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import {
  AddCollectionItemCommandResult,
  CommandResult,
  CreateAssessmentCommandResult,
  CreateCollectionCommandResult,
} from '../interfaces/aap-api/commandResult'
import {
  TimelineQueryResult,
  AssessmentVersionQueryResult,
  CollectionItemQueryResult,
  CollectionQueryResult,
} from '../interfaces/aap-api/queryResult'
import {
  AddCollectionItemCommand,
  Commands,
  CreateAssessmentCommand,
  CreateCollectionCommand,
  CreateTimelineItemCommand,
  RemoveCollectionItemCommand,
  ReorderCollectionItemCommand,
  RollbackCommand,
  SoftDeleteCommand,
  UndeleteCommand,
  UpdateAssessmentAnswersCommand,
  UpdateAssessmentPropertiesCommand,
  UpdateCollectionItemAnswersCommand,
  UpdateCollectionItemPropertiesCommand,
  UpdateFlagsCommand,
  UpdateFormVersionCommand,
} from '../interfaces/aap-api/command'
import {
  TimelineQuery,
  AssessmentVersionQuery,
  CollectionItemQuery,
  CollectionQuery,
} from '../interfaces/aap-api/query'

interface CommandMap {
  CreateAssessment: { cmd: CreateAssessmentCommand; res: CreateAssessmentCommandResult }
  CreateTimelineItem: { cmd: CreateTimelineItemCommand; res: CommandResult }
  UpdateAssessmentAnswers: { cmd: UpdateAssessmentAnswersCommand; res: CommandResult }
  Rollback: { cmd: RollbackCommand; res: CommandResult }
  SoftDelete: { cmd: SoftDeleteCommand; res: CommandResult }
  Undelete: { cmd: UndeleteCommand; res: CommandResult }
  UpdateAssessmentProperties: { cmd: UpdateAssessmentPropertiesCommand; res: CommandResult }
  UpdateFlags: { cmd: UpdateFlagsCommand; res: CommandResult }
  UpdateFormVersion: { cmd: UpdateFormVersionCommand; res: CommandResult }
  CreateCollection: { cmd: CreateCollectionCommand; res: CreateCollectionCommandResult }
  AddCollectionItem: { cmd: AddCollectionItemCommand; res: AddCollectionItemCommandResult }
  UpdateCollectionItemAnswers: { cmd: UpdateCollectionItemAnswersCommand; res: CommandResult }
  UpdateCollectionItemProperties: { cmd: UpdateCollectionItemPropertiesCommand; res: CommandResult }
  RemoveCollectionItem: { cmd: RemoveCollectionItemCommand; res: CommandResult }
  ReorderCollectionItem: { cmd: ReorderCollectionItemCommand; res: CommandResult }
}

interface QueryMap {
  AssessmentVersion: { query: AssessmentVersionQuery; res: AssessmentVersionQueryResult }
  Timeline: { query: TimelineQuery; res: TimelineQueryResult }
  Collection: { query: CollectionQuery; res: CollectionQueryResult }
  CollectionItem: { query: CollectionItemQuery; res: CollectionItemQueryResult }
}

export default class AssessmentService {
  constructor(private readonly assessmentPlatformApiClient: AssessmentPlatformApiClient) {}

  async command<T extends keyof CommandMap>(cmd: CommandMap[T]['cmd']): Promise<CommandMap[T]['res']> {
    const [result] = await this.assessmentPlatformApiClient.executeCommands(cmd)
    return result as CommandMap[T]['res']
  }

  async commands(commands: readonly Commands[]) {
    await this.assessmentPlatformApiClient.executeCommands(...commands)
  }

  async query<T extends keyof QueryMap>(query: QueryMap[T]['query']): Promise<QueryMap[T]['res']> {
    const [result] = await this.assessmentPlatformApiClient.executeQueries(query)
    return result as QueryMap[T]['res']
  }
}
