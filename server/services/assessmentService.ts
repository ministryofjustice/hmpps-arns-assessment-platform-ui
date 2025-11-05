import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import {
  AssessmentVersionQueryResult,
  CommandsRequest,
  CommandsResponse,
  CreateAssessmentCommandResult,
  QueriesRequest,
  QueriesResponse,
} from '../interfaces/assessment'
import { User } from '../interfaces/user'
import { HmppsUser } from '../interfaces/hmppsUser'
import AuditService, { AuditEvent } from './auditService'

export default class AssessmentService {
  constructor(
    private readonly assessmentPlatformApiClient: AssessmentPlatformApiClient,
    private readonly auditService: AuditService,
  ) {}

  async createAssessment(
    hmppsUser: HmppsUser,
    correlationId: string,
  ): Promise<{ assessmentUuid: string; message: string }> {
    const user: User = {
      id: hmppsUser.userId,
      name: hmppsUser.displayName,
    }

    const request: CommandsRequest = {
      commands: [
        {
          type: 'CreateAssessmentCommand',
          user,
        },
      ],
    }

    const response = await this.assessmentPlatformApiClient.executeCommand<CommandsResponse>(request)
    const commandResult = response.commands[0].result as CreateAssessmentCommandResult

    await this.auditService.send(AuditEvent.CREATE_ASSESSMENT, {
      username: hmppsUser.username,
      correlationId,
      assessmentUuid: commandResult.assessmentUuid,
    })

    return {
      assessmentUuid: commandResult.assessmentUuid,
      message: commandResult.message,
    }
  }

  async getAssessment(
    hmppsUser: HmppsUser,
    assessmentUuid: string,
    correlationId: string,
    timestamp?: string,
  ): Promise<AssessmentVersionQueryResult> {
    const user: User = {
      id: hmppsUser.userId,
      name: hmppsUser.displayName,
    }

    const request: QueriesRequest = {
      queries: [
        {
          type: 'AssessmentVersionQuery',
          user,
          assessmentUuid,
          ...(timestamp && { timestamp }),
        },
      ],
    }

    const response = await this.assessmentPlatformApiClient.executeQuery<QueriesResponse>(request)

    await this.auditService.send(AuditEvent.VIEW_ASSESSMENT, {
      username: hmppsUser.username,
      correlationId,
      assessmentUuid,
    })

    return response.queries[0].result as AssessmentVersionQueryResult
  }
}
