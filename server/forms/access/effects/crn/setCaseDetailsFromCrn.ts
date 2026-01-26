import { BadRequest } from 'http-errors'
import { AccessContext, AccessEffectsDeps } from '../types'

/**
 * Load case details from Delius by CRN and store in session.
 *
 * Gets CRN from route parameter, fetches case details from Delius API,
 * and stores the result in session.
 */
export const setCaseDetailsFromCrn = (deps: AccessEffectsDeps) => async (context: AccessContext) => {
  const crn = context.getRequestParam('crn')

  if (!crn) {
    throw new BadRequest('CRN is required')
  }

  const session = context.getSession()
  session.caseDetails = await deps.deliusApi.getCaseDetails(crn)
}
