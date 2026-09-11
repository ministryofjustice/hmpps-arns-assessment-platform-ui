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
 * The calls are settled separately so a tier failure never blocks the package.
 * Package outcome: context object (200, incl. in-flight) → stored, guard decides the
 * tab; null (404) → nothing stored, tab hidden; error (500/503) → error message.
 */
export const loadSupervisionPackage = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const crn = context.getSession().caseDetails?.crn

  if (!crn) {
    logger.error('Cannot load supervision package: missing CRN in session')

    return
  }

  const [packageResult, tierResult] = await Promise.allSettled([
    deps.mpopComponents.getSupervisionPackageFrontendContext(asSystem(), crn),
    deps.mpopComponents.getTierDetails(asSystem(), crn),
  ])

  // Tier is secondary — a failure never sets the package status; the component shows an
  // 'Unavailable' tier and carries on.
  if (tierResult.status === 'fulfilled') {
    logTierOutcome(crn, tierResult.value.httpStatus)
    context.setData('tierCalculation', tierResult.value.calculation)
  } else {
    logger.error({ err: tierResult.reason, crn }, 'Failed to fetch tier details from MPoP Components API')
  }

  // Record a failure (drives the error message) or store a returned context (guard reads its
  // phase code). A null return is a genuine 404 — nothing to store, tab stays hidden.
  if (packageResult.status === 'rejected') {
    context.setData('supervisionPackageError', true)
    logger.error({ err: packageResult.reason, crn }, 'Failed to load supervision package')
  } else if (packageResult.value) {
    context.setData('supervisionPackageDetails', packageResult.value)
  } else {
    logger.info({ crn }, 'No supervision package for this person yet')
  }
}
