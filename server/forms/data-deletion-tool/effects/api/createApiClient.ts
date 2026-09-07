import { InternalServerError } from 'http-errors'
import { dataDeletionToolConfig } from '../../config'
import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

const { environments } = dataDeletionToolConfig

type Environment = keyof typeof environments

const isValidEnvironment = (value: string): value is Environment => {
  return value in environments
}

export const createApiClient = (deps: DataDeletionToolEffectsDeps, context: DataDeletionToolContext) => {
  const answers = context.getSession().answers

  if (!answers.environment || !isValidEnvironment(answers.environment)) {
    throw new InternalServerError(`A valid environment is required`)
  }

  const { apiUrl, authenticationUrl } = environments[answers.environment]

  return deps.assessmentPlatformApiFactory.create({
    apiUrl,
    authenticationUrl,
    clientId: answers.clientId,
    clientSecret: answers.clientSecret,
  })
}
