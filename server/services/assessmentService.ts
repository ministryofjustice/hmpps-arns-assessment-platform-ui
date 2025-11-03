import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import SessionService from './sessionService'
import {
  AssessmentVersionQueryResult,
  CommandsRequest,
  CommandsResponse,
  CreateAssessmentCommandResult,
  QueriesRequest,
  QueriesResponse,
} from '../@types/Assessment'
import { User } from '../@types/User'
import AuditService, { AuditEvent } from './auditService'

export default class AssessmentService {
  constructor(
    private readonly assessmentPlatformApiClient: AssessmentPlatformApiClient,
    private readonly sessionService: SessionService,
    private readonly auditService: AuditService,
  ) {}

  async createAssessment(): Promise<{ assessmentUuid: string; message: string }> {
    await this.auditService.send(AuditEvent.CREATE_ASSESSMENT)

    const principal = this.sessionService.getPrincipalDetails()
    if (!principal) {
      throw new Error('User not found in session')
    }

    const user: User = {
      id: principal.identifier,
      name: principal.displayName,
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

    return {
      assessmentUuid: commandResult.assessmentUuid,
      message: commandResult.message,
    }
  }

  async getAssessment(assessmentUuid: string, timestamp?: string): Promise<AssessmentVersionQueryResult> {
    await this.auditService.send(AuditEvent.VIEW_ASSESSMENT)

    const principal = this.sessionService.getPrincipalDetails()
    if (!principal) {
      throw new Error('User not found in session')
    }

    const user: User = {
      id: principal.identifier,
      name: principal.displayName,
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

    return response.queries[0].result as AssessmentVersionQueryResult
  }
}
