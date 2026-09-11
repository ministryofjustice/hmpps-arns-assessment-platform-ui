import { InternalServerError } from 'http-errors'
import { AuthenticationClient, InMemoryTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { DataDeletionToolContext } from '../types'
import AssessmentPlatformApiClient from '../../../../data/assessmentPlatformApiClient'
import config from '../../../../config'
import logger from '../../../../../logger'

const environments = config.forms.dataDeletionTool.environments

type Environment = keyof typeof environments

const isValidEnvironment = (value: string): value is Environment => {
  return value in environments
}

export const createApiClient = (context: DataDeletionToolContext) => {
  const answers = context.getSession().answers

  if (!answers.environment || !isValidEnvironment(answers.environment)) {
    throw new InternalServerError(`A valid environment is required`)
  }

  const environment = environments[answers.environment]

  const hmppsAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      url: environment.authUrl,
      systemClientId: answers.clientId,
      systemClientSecret: answers.clientSecret,
    },
    logger,
    new InMemoryTokenStore(),
  )

  return new AssessmentPlatformApiClient(hmppsAuthClient, null, { url: environment.apiUrl })
}
