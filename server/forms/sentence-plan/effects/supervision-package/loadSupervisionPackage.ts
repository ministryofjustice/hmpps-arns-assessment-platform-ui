import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../../logger'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * A 404 means the person has no tier, package or upcoming appointment yet — normal
 * states the component renders on its own. Logging those at info keeps genuine
 * failures visible without raising an alert on every page view.
 */
const logOutcome = (crn: string, httpStatus: number, emptyMessage: string, failureMessage: string) => {
  if (httpStatus === 200) {
    return
  }

  if (httpStatus === 404) {
    logger.info({ crn }, emptyMessage)

    return
  }

  logger.error({ crn, httpStatus }, failureMessage)
}

/**
 * Loads the supervision package, tier and next appointment for the person in session.
 *
 * Each failure is logged and leaves only its own data unset, so one API being
 * down never blocks the other two. The component already renders a usable state
 * without each piece — a provisional package, an 'Unavailable' tier, or
 * "No appointments scheduled" — so nothing here surfaces an error to the user.
 */
export const loadSupervisionPackage = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const crn = context.getSession().caseDetails?.crn

  if (!crn) {
    logger.error('Cannot load supervision package: missing CRN in session')

    return
  }

  try {
    const [supervisionPackageResponse, tierDetailsResponse, personScheduleResponse] = await Promise.all([
      deps.mpopComponents.getSupervisionPackage(asSystem(), crn),
      deps.mpopComponents.getTierDetails(asSystem(), crn),
      deps.mpopComponents.getPersonSchedule(asSystem(), crn),
    ])

    logOutcome(
      crn,
      tierDetailsResponse.httpStatus,
      'No confirmed tier for this person yet',
      'Failed to fetch tier details from MPoP Components API',
    )

    context.setData('tierCalculation', tierDetailsResponse.calculation)

    logOutcome(
      crn,
      personScheduleResponse.httpStatus,
      'No upcoming appointments for this person',
      'Failed to fetch next appointment from MPoP Components API',
    )

    const appointment = personScheduleResponse.personSchedule?.personSchedule?.appointments?.[0]

    if (appointment?.type && appointment.startDateTime) {
      context.setData('nextAppointment', {
        description: appointment.type,
        date: appointment.startDateTime,
        // The component only renders the appointment when href is truthy, and always
        // renders it as a link, so '' would hide the appointment altogether.
        // TODO: Probably should drop this once MPoP make href optional — see the
        // change-list on the NextAppointment type in effects/types.ts.
        href: '#',
      })
    }

    logOutcome(
      crn,
      supervisionPackageResponse.httpStatus,
      'No supervision package for this person yet, rendering the provisional state',
      'Failed to fetch supervision package from MPoP Components API',
    )

    if (supervisionPackageResponse.httpStatus === 200 && supervisionPackageResponse.supervisionPackage) {
      context.setData('supervisionPackageDetails', supervisionPackageResponse.supervisionPackage)
    }
  } catch (error) {
    logger.error({ err: error, crn }, 'Failed to load supervision package data')
  }
}
