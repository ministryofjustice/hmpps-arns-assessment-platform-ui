import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Sends a telemetry event to App Insights, enriched with assessmentUuid, requestId,
 * and a telemetryCorrelationId for pairing events across requests in KQL.
 *
 * @param startCorrelation - Pass `true` at the start of a journey to capture the current
 *   request ID as the correlation ID (only on GET requests to avoid POST re-fires).
 *   All events after this share the same correlation ID until the next `true`.
 *
 * @example
 * SentencePlanEffects.sendTelemetryEvent('CREATE_GOAL_START', true)
 * SentencePlanEffects.sendTelemetryEvent('CREATE_GOAL_WITH_STEPS_END', false)
 */
export const sendTelemetryEvent =
  (_deps: SentencePlanEffectsDeps) => (context: SentencePlanContext, eventName: string, startCorrelation?: boolean) => {
    const assessmentUuid = context.getData('assessmentUuid')
    const session = context.getSession()

    if (startCorrelation) {
      const isGetRequest = Object.keys(context.getPostData() ?? {}).length === 0

      if (isGetRequest) {
        session.telemetryCorrelationId = context.getState('requestId')
      }
    }

    telemetry.trackEvent(eventName, {
      assessmentUuid,
      requestId: context.getState('requestId'),
      telemetryCorrelationId: session.telemetryCorrelationId,
    })
  }
