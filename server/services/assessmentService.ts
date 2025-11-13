import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import { CommandsRequest, QueriesRequest } from '../interfaces/aap-api/request'
import {
  AddCollectionItemCommandResult,
  CommandResult,
  CreateAssessmentCommandResult,
  CreateCollectionCommandResult,
} from '../interfaces/aap-api/commandResult'
import {
  AssessmentTimelineQueryResult,
  AssessmentVersionQueryResult, CollectionItemQueryResult,
  CollectionQueryResult,
} from '../interfaces/aap-api/queryResult'
import {
  AddCollectionItemCommand,
  Commands,
  CreateAssessmentCommand,
  CreateCollectionCommand,
  RemoveCollectionItemCommand,
  ReorderCollectionItemCommand,
  RollBackAssessmentAnswersCommand,
  UpdateAssessmentAnswersCommand,
  UpdateAssessmentPropertiesCommand,
  UpdateCollectionItemAnswersCommand,
  UpdateCollectionItemPropertiesCommand,
  UpdateFormVersionCommand,
} from '../interfaces/aap-api/command'
import {
  AssessmentTimelineQuery,
  AssessmentVersionQuery,
  CollectionItemQuery,
  CollectionQuery
} from '../interfaces/aap-api/query'

interface CommandMap {
  CreateAssessment: { cmd: CreateAssessmentCommand; res: CreateAssessmentCommandResult }
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
  AssessmentTimeline: { query: AssessmentTimelineQuery; res: AssessmentTimelineQueryResult }
  Collection: { query: CollectionQuery; res: CollectionQueryResult }
  CollectionItem: { query: CollectionItemQuery; res: CollectionItemQueryResult }
}

export default class AssessmentService {
  constructor(private readonly assessmentPlatformApiClient: AssessmentPlatformApiClient) {}

  async command<T extends keyof CommandMap>(cmd: CommandMap[T]['cmd']): Promise<CommandMap[T]['res']> {
    const request: CommandsRequest = { commands: [cmd] }
    const response = await this.assessmentPlatformApiClient.executeCommands(request)
    return response.commands[0].result as CommandMap[T]['res']
  }

  async commands(commands: Array<Commands>) {
    const request: CommandsRequest = { commands }
    await this.assessmentPlatformApiClient.executeCommands(request)
  }

  async query<T extends keyof QueryMap>(query: QueryMap[T]['query']): Promise<QueryMap[T]['res']> {
    const request: QueriesRequest = { queries: [query] }
    const response = await this.assessmentPlatformApiClient.executeQueries(request)
    return response.queries[0].result as QueryMap[T]['res']
  }
}
