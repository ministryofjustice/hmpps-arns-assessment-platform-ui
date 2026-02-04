import type { SpanKind, SpanStatus } from '@opentelemetry/api'

/**
 * Information about a span, provided to the processSpan callback.
 * This is a simplified view of the span for easy processing.
 */
export interface SpanInfo {
  /** The span name (operation name) */
  name: string

  /** The kind of span: CLIENT, SERVER, INTERNAL, PRODUCER, CONSUMER */
  kind: SpanKind

  /** Span attributes (tags/dimensions) */
  attributes: Record<string, unknown>

  /** Span duration in milliseconds */
  durationMs: number

  /** Span status */
  status: SpanStatus
}

/**
 * Modifications to apply to a span.
 * Return from a span processor to modify the span before export.
 */
export interface SpanModifications {
  /** New name for the span. Omit to keep the original name. */
  name?: string
}

/**
 * Function to process a span before export.
 * Return null to drop the span, or modifications to apply.
 */
export type SpanProcessorFn = (span: SpanInfo) => SpanModifications | null
