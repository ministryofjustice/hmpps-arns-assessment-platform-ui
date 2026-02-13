import { SentencePlanContext } from '../types'
import { addNotification } from './addNotification'

/**
 * Build possessive for the person's name used in confirmation messaging.
 * Falls back to "their" if no forename is available in session.
 */
export function getPlanOwnerPossessive(context: SentencePlanContext): string {
  const forename = context.getSession().caseDetails?.name?.forename

  if (!forename) {
    return 'their'
  }

  if (forename.toLowerCase().endsWith('s')) {
    return `${forename}'`
  }

  return `${forename}'s`
}

/**
 * Queue a one-time success alert for plan overview.
 * This is a "flash" message: it is shown once, then removed from session.
 */
export async function addPlanOverviewSuccessNotification(
  context: SentencePlanContext,
  message: string,
  title?: string,
): Promise<void> {
  await addNotification()(context, {
    type: 'success',
    title,
    message,
    target: 'plan-overview',
  })
}
