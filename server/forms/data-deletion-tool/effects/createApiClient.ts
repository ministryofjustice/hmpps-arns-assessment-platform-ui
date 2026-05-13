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
  const env = context.getAnswer('environment') as string

  if (!env || !isValidEnvironment(env)) {
    throw new InternalServerError(`A valid environment is required`)
  }

  const environment = environments[env]

  const hmppsAuthClient = new AuthenticationClient(
    {
      ...config.apis.hmppsAuth,
      url: environment.authUrl,
      systemClientId: context.getAnswer('clientId') as string,
      systemClientSecret: context.getAnswer('clientSecret') as string,
    },
    logger,
    new InMemoryTokenStore(),
  )

  return new AssessmentPlatformApiClient(hmppsAuthClient, null, { url: environment.apiUrl })
}
