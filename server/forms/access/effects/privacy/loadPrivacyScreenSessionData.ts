import { BadRequest } from 'http-errors'
import { getTargetService } from '../../registry'
import { AccessContext } from '../types'

export const loadPrivacyScreenSessionData = () => (context: AccessContext) => {
  const session = context.getSession()
  const targetServiceKey = session.targetService

  if (!targetServiceKey) {
    throw new BadRequest('Target service not found in session')
  }

  const targetService = getTargetService(targetServiceKey)

  if (!targetService) {
    throw new BadRequest(`Unknown target service: ${targetServiceKey}`)
  }

  if (!session.accessDetails) {
    throw new BadRequest('Access details not found in session')
  }

  if (!session.caseDetails) {
    throw new BadRequest('Case details not found in session')
  }

  context.setData('session', session)
  context.setData('accessDetails', session.accessDetails)
  context.setData('caseData', session.caseDetails)
  context.setData('targetService', targetServiceKey)
  context.setData('redirectPath', targetService.serviceEntryPath)
}
