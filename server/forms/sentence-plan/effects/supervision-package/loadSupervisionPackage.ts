import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../../logger'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * A 404 means the person has no confirmed tier yet — a normal state the component
 * renders on its own. Logging it at info keeps genuine failures visible without
 * raising an alert on every page view.
 */
const logTierOutcome = (crn: string, httpStatus: number) => {
  if (httpStatus === 200) {
    return
  }

  if (httpStatus === 404) {
    logger.info({ crn }, 'No confirmed tier for this person yet')

    return
  }

  logger.error({ crn, httpStatus }, 'Failed to fetch tier details from MPoP Components API')
}

/**
 * Loads the supervision package and tier for the person in session.
 *
 * The supervision package frontend context bundles the phase, appointment
 * allowance and next appointment in a single call; a null response is the normal
 * "no package yet" state the component renders as provisional. Tier comes from a
 * separate call. The two are independent, so one failing never blocks the other,
 * and nothing here surfaces an error to the user.
 */
export const loadSupervisionPackage = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const crn = context.getSession().caseDetails?.crn

  if (!crn) {
    logger.error('Cannot load supervision package: missing CRN in session')

    return
  }

  try {
    const [supervisionPackage, tierDetailsResponse] = await Promise.all([
      deps.mpopComponents.getSupervisionPackageFrontendContext(asSystem(), crn),
      deps.mpopComponents.getTierDetails(asSystem(), crn),
    ])

    logTierOutcome(crn, tierDetailsResponse.httpStatus)
    context.setData('tierCalculation', tierDetailsResponse.calculation)

    if (supervisionPackage) {
      context.setData('supervisionPackageDetails', supervisionPackage)
    } else {
      logger.info({ crn }, 'No supervision package for this person yet, rendering the provisional state')
    }
  } catch (error) {
    logger.error({ err: error, crn }, 'Failed to load supervision package data')
  }
}
