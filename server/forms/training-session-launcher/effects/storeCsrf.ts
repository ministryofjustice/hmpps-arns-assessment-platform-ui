import { InternalServerError } from 'http-errors'
import { TrainingSessionLauncherContext } from '../types'

export const storeCsrf = () => (context: TrainingSessionLauncherContext) => {
  const csrfToken = context.getState('csrfToken')

  if (!csrfToken) {
    throw new InternalServerError('Missing CSRF token in req.state')
  }

  context.setData('csrfToken', csrfToken)
}
