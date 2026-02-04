import { SpanKind } from '@opentelemetry/api'

import type { SpanProcessorFn } from '../types/SpanProcessor'

/**
 * Processor that filters out outgoing HTTP calls (CLIENT spans).
 * Trace context is still propagated to downstream services.
 *
 * @example
 * processSpan: [
 *   telemetry.helpers.filterSpanWhereClient,
 * ]
 */
export const filterSpanWhereClient: SpanProcessorFn = span => {
  return span.kind === SpanKind.CLIENT ? null : {}
}
