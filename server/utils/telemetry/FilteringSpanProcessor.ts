import type { Context, Span } from '@opentelemetry/api'
import type { ReadableSpan, SpanProcessor } from '@opentelemetry/sdk-trace-base'

import type { SpanInfo, SpanProcessorFn } from './types/SpanProcessor'

/**
 * Custom SpanProcessor that wraps another processor and allows
 * filtering and modification of spans before export.
 *
 * This processor:
 * 1. Converts ReadableSpan to SpanInfo for easy processing
 * 2. Runs each processor function in order
 * 3. Applies modifications (like renaming) to the span
 * 4. Forwards to the delegate processor, or drops the span if any processor returns null
 */
export class FilteringSpanProcessor implements SpanProcessor {
  private readonly delegate: SpanProcessor

  private readonly processors: SpanProcessorFn[]

  constructor(delegate: SpanProcessor, processors: SpanProcessorFn[] = []) {
    this.delegate = delegate
    this.processors = processors
  }

  forceFlush(): Promise<void> {
    return this.delegate.forceFlush()
  }

  shutdown(): Promise<void> {
    return this.delegate.shutdown()
  }

  onStart(_span: Span, _parentContext: Context): void {
    // Span creation is handled by the SDK - we only filter/modify on onEnd
  }

  onEnd(span: ReadableSpan): void {
    if (this.processors.length === 0) {
      this.delegate.onEnd(span)
      return
    }

    const spanInfo = this.toSpanInfo(span)

    for (const processor of this.processors) {
      const result = processor(spanInfo)

      if (result === null) {
        return
      }

      if (result.name) {
        ;(span as { name: string }).name = result.name
      }
    }

    this.delegate.onEnd(span)
  }

  private toSpanInfo(span: ReadableSpan): SpanInfo {
    const durationNanos = span.duration[0] * 1e9 + span.duration[1]
    const durationMs = durationNanos / 1e6

    return {
      name: span.name,
      kind: span.kind,
      attributes: span.attributes as Record<string, unknown>,
      durationMs,
      status: span.status,
    }
  }
}
