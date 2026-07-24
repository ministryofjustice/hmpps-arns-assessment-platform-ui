import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import { RiskScoreInput, RiskScores } from '../interfaces/risk-actuarial-api/riskScores'

export default class RiskActuarialApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Risk actuarial API', config.apis.riskActuarialApi, logger, authenticationClient)
  }

  async getRiskScores(input: RiskScoreInput): Promise<RiskScores> {
    return this.post({ path: `/risk-scores/v1`, data: { ...input } }, asSystem())
  }
}
