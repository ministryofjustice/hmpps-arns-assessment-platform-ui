import {
  AddCollectionItemCommandResult,
  CommandResult,
  CreateAssessmentCommandResult,
  CreateCollectionCommandResult,
  GroupCommandResult,
} from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentCommandResult.type'
import {
  TimelineQueryResult,
  AssessmentVersionQueryResult,
  CollectionItemQueryResult,
  CollectionQueryResult,
} from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentQueryResult.type'
import {
  AddCollectionItemCommand,
  Commands,
  CreateAssessmentCommand,
  CreateCollectionCommand,
  GroupCommand,
  RemoveCollectionItemCommand,
  ReorderCollectionItemCommand,
  RollBackAssessmentAnswersCommand,
  UpdateAssessmentAnswersCommand,
  UpdateAssessmentPropertiesCommand,
  UpdateCollectionItemAnswersCommand,
  UpdateCollectionItemPropertiesCommand,
  UpdateFormVersionCommand,
} from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentCommand.type'
import {
  TimelineQuery,
  AssessmentVersionQuery,
  CollectionItemQuery,
  CollectionQuery,
} from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentQuery.type'
import type { AssessmentPlatformApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApi.type'

interface CommandMap {
  CreateAssessment: { cmd: CreateAssessmentCommand; res: CreateAssessmentCommandResult }
  Group: { cmd: GroupCommand; res: GroupCommandResult }
  UpdateAssessmentAnswers: { cmd: UpdateAssessmentAnswersCommand; res: CommandResult }
  RollBackAssessmentAnswers: { cmd: RollBackAssessmentAnswersCommand; res: CommandResult }
  UpdateAssessmentProperties: { cmd: UpdateAssessmentPropertiesCommand; res: CommandResult }
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
  constructor(private readonly assessmentPlatformApi: AssessmentPlatformApi) {}

  async command<T extends keyof CommandMap>(cmd: CommandMap[T]['cmd']): Promise<CommandMap[T]['res']> {
    const [result] = await this.assessmentPlatformApi.executeCommands(cmd)

    return result as CommandMap[T]['res']
  }

  async commands(commands: readonly Commands[]) {
    await this.assessmentPlatformApi.executeCommands(...commands)
  }

  async query<T extends keyof QueryMap>(query: QueryMap[T]['query']): Promise<QueryMap[T]['res']> {
    const result = await this.assessmentPlatformApi.executeQuery(query)

    return result as QueryMap[T]['res']
  }
}
