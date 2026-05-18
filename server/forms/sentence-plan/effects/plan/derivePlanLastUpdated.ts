import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'
import { AgreementStatus, HistoricPlanData, SentencePlanContext } from '../types'

export interface LastUpdatedData {
  isUpdatedAfterAgreement: boolean
  lastUpdatedDate?: Date
  lastUpdatedByName?: string
}

/**
 * Derive whether the plan was updated after agreement.
 *
 * Compares the most recent timeline event against the agreement date.
 * If any goal event occurred after agreement, sets flags for displaying
 * "Last updated on [date] by [person]" instead of the "Plan agreed" message.
 *
 * Requires:
 * - Data('planTimeline'): Populated by loadPlanTimeline
 * - Data('latestAgreementDate'): Populated by derivePlanAgreementsFromAssessment
 * - Data('latestAgreementStatus'): Populated by derivePlanAgreementsFromAssessment
 *
 * Sets:
 * - Data('isUpdatedAfterAgreement'): Boolean
 * - Data('lastUpdatedDate'): Date of the most recent update (when updated after agreement)
 * - Data('lastUpdatedByName'): Name of who last updated (when updated after agreement)
 */
export const derivePlanLastUpdated = () => (context: SentencePlanContext) => {
  const result = derivePlanLastUpdatedData(
    context.getData('planTimeline') as TimelineItem[] | undefined,
    context.getData('latestAgreementDate') as Date | undefined,
    context.getData('latestAgreementStatus') as AgreementStatus,
  )

  context.setData('isUpdatedAfterAgreement', result.isUpdatedAfterAgreement)
  context.setData('lastUpdatedDate', result.lastUpdatedDate)
  context.setData('lastUpdatedByName', result.lastUpdatedByName)
}

/**
 * Derive whether a historic plan version was updated after agreement.
 *
 * Same logic as derivePlanLastUpdated but operates on Data('historic') and
 * filters timeline events to only those before the point-in-time snapshot.
 *
 * Requires:
 * - Data('planTimeline'): Populated by loadPlanTimeline
 * - Data('historic'): Populated by loadHistoricPlan
 * - URL param 'timestamp': Point-in-time for the historic version
 *
 * Sets (merged into Data('historic')):
 * - historic.isUpdatedAfterAgreement
 * - historic.lastUpdatedDate
 * - historic.lastUpdatedByName
 */
export const derivePlanLastUpdatedForHistoric = () => (context: SentencePlanContext) => {
  const historic = context.getData('historic') as HistoricPlanData | undefined

  if (!historic) {
    return
  }

  const timestamp = context.getRequestParam('timestamp')
  const pointInTime = timestamp ? new Date(Number(timestamp)) : undefined

  const result = derivePlanLastUpdatedData(
    context.getData('planTimeline') as TimelineItem[] | undefined,
    historic.latestAgreementDate,
    historic.latestAgreementStatus,
    pointInTime,
  )

  context.setData('historic', {
    ...historic,
    isUpdatedAfterAgreement: result.isUpdatedAfterAgreement,
    lastUpdatedDate: result.lastUpdatedDate,
    lastUpdatedByName: result.lastUpdatedByName,
  })
}

/**
 * Core derivation logic shared by current and historic plan views.
 *
 * @param beforeDate - When provided, only considers timeline events before this date.
 *                     Used by historic views to scope to the point-in-time snapshot.
 */
export const derivePlanLastUpdatedData = (
  planTimeline: TimelineItem[] | undefined,
  latestAgreementDate: Date | undefined,
  latestAgreementStatus: AgreementStatus,
  beforeDate?: Date,
): LastUpdatedData => {
  const noUpdate: LastUpdatedData = { isUpdatedAfterAgreement: false }

  if (!latestAgreementDate || latestAgreementStatus === 'DRAFT') {
    return noUpdate
  }

  if (!planTimeline?.length) {
    return noUpdate
  }

  let events = planTimeline

  if (beforeDate) {
    events = events.filter(e => new Date(e.timestamp).getTime() <= beforeDate.getTime())
  }

  if (!events.length) {
    return noUpdate
  }

  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const mostRecentEvent = sortedEvents[0]

  if (!mostRecentEvent) {
    return noUpdate
  }

  const eventDate = new Date(mostRecentEvent.timestamp)

  if (eventDate.getTime() <= latestAgreementDate.getTime()) {
    return noUpdate
  }

  // Each event type stores the actor under a different key
  const customData = mostRecentEvent.customData ?? {}
  const updatedByName =
    customData.updatedBy ??
    customData.createdBy ??
    customData.achievedBy ??
    customData.removedBy ??
    customData.readdedBy ??
    mostRecentEvent.user?.name ??
    'Unknown'

  return {
    isUpdatedAfterAgreement: true,
    lastUpdatedDate: eventDate,
    lastUpdatedByName: updatedByName,
  }
}
