import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { AssessmentNeedsDto } from '../interfaces/arns-api/assessmentNeeds'

export default class ArnsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('ARNS API', config.apis.arnsApi, logger, authenticationClient)
  }

  /**
   * Get criminogenic needs for a CRN from the assessment-controller endpoint.
   *
   * Called with the user's own token (pass-through) rather than a system token: this
   * endpoint enforces limited-access-offender (LAO) checks against the actual user, so a
   * 403 means the user may not view this case and is a data state to surface, not a failure.
   */
  async getCriminogenicNeeds(crn: string, token: string): Promise<AssessmentNeedsDto> {
    return this.get({ path: `/needs/crn/${crn}` }, asUser(token))
  }
}
