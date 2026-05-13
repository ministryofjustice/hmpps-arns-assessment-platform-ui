import { InternalServerError } from 'http-errors'
import { DataDeletionToolContext } from './types';
import AssessmentPlatformApiClient from '../../../data/assessmentPlatformApiClient';
import { AuthenticationClient, InMemoryTokenStore } from '@ministryofjustice/hmpps-auth-clients';
import config from '../../../config';
import logger from '../../../../logger';

const environments = config.forms.dataDeletionTool.environments

type Environment = keyof typeof environments

const isValidEnvironment = (value: string): value is Environment => {
  return value in environments
}

export const createApiClient = (context: DataDeletionToolContext) => {
  const session = context.getSession()

  if (!session.environment || !isValidEnvironment(session.environment)) {
    throw new InternalServerError(`A valid environment is required`)
  }

  const environment = environments[session.environment]

  const hmppsAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      url: environment.authUrl,
      systemClientId: session.clientId,
      systemClientSecret: session.clientSecret,
    },
    logger,
    new InMemoryTokenStore(),
  )

  return new AssessmentPlatformApiClient(hmppsAuthClient, null, { url: environment.apiUrl })
}
