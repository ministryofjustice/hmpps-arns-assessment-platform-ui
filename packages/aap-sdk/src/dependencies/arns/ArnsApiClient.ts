import { RestClient, asSystem, asUser, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'
import type { AssessmentNeedsDto } from './ArnsAssessmentNeeds.type'
import type { AssessmentNeedsDetailsDto } from './ArnsAssessmentNeedsDetails.type'

export default class ArnsApiClient extends RestClient {
  constructor(apiConfig: ApiConfig, authenticationClient: AuthenticationClient, logger: Logger | Console) {
    super('ARNS API', apiConfig, logger, authenticationClient)
  }

  /**
   * Called as the user so the endpoint's limited-access-offender checks run against them; a 403 is
   * an expected "cannot view this case" state, not an error. excludeIncomplete is false because an
   * OASys assessment only reaches COMPLETE once the whole thing (RoSH included) is signed off.
   */
  async getCriminogenicNeeds(crn: string, token: string): Promise<AssessmentNeedsDto> {
    return this.get({ path: `/needs/crn/${crn}`, query: { excludeIncomplete: false } }, asUser(token))
  }

  /**
   * Called with a system token because OASys sessions carry no user token; the integration endpoint
   * runs no per-request LAO check, so the crn must come from the handover session, never a route param.
   */
  async getCriminogenicNeedsDetails(crn: string): Promise<AssessmentNeedsDetailsDto> {
    return this.get({ path: `/needs/${crn}`, query: { excludeIncomplete: false } }, asSystem())
  }
}
