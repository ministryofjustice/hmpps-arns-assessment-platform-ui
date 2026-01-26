import { BadRequest } from 'http-errors'
import { AccessContext } from '../types'
import { getTargetService } from '../../registry'

/**
 * Validate target service from route parameter and set redirect path.
 *
 * Reads the :service param from the route, validates it exists in the registry,
 * stores it in session, and sets the redirect path in data.
 */
export const setTargetServiceAndRedirect = () => (context: AccessContext) => {
  const service = context.getRequestParam('service')

  if (!service) {
    throw new BadRequest('Service parameter is required')
  }

  const targetService = getTargetService(service)

  if (!targetService) {
    throw new BadRequest(`Unknown target service: ${service}`)
  }

  const session = context.getSession()

  session.targetService = service
  context.setData('redirectPath', targetService.entryPath)
}
