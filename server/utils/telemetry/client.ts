import { trace, SpanStatusCode, Span } from '@opentelemetry/api'

import { getConfig } from './config'

function getTracer() {
  const config = getConfig()
  return trace.getTracer(config?.serviceName ?? 'hmpps-azure-telemetry')
}

/**
 * Telemetry client for custom spans and events.
 *
 * @example
 * import { telemetry } from './utils/telemetry'
 *
 * // Add an event to the current span
 * telemetry.addSpanEvent('UserLoggedIn', { userId: '123' })
 *
 * // Wrap an operation in a span
 * await telemetry.withSpan('processPayment', async (span) => {
 *   span.setAttribute('amount', 100)
 *   await chargeCard()
 * })
 */
export const telemetry = {
  /**
   * Set attributes on the current active span.
   *
   * @param attributes - Attributes to set
   */
  setSpanAttributes(attributes: Record<string, string | number | boolean>): void {
    const span = trace.getActiveSpan()

    if (span) {
      for (const [key, value] of Object.entries(attributes)) {
        span.setAttribute(key, value)
      }
    }
  },

  /**
   * Add an event to the current active span (point-in-time occurrence).
   *
   * @param name - Event name
   * @param attributes - Optional attributes to attach
   */
  addSpanEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    const span = trace.getActiveSpan()

    if (span) {
      span.addEvent(name, attributes)
    } else {
      const tracer = getTracer()
      const newSpan = tracer.startSpan(name)

      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          newSpan.setAttribute(key, value)
        })
      }

      newSpan.end()
    }
  },

  /**
   * Wrap an operation in a span with automatic error handling.
   *
   * @param name - Span name
   * @param fn - Function to execute within the span
   * @returns The result of the function
   *
   * @example
   * const result = await telemetry.withSpan('processPayment', async (span) => {
   *   span.setAttribute('orderId', '123')
   *   return await processPayment()
   * })
   */
  async withSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> {
    const tracer = getTracer()
    const span = tracer.startSpan(name)

    try {
      const result = await fn(span)
      span.setStatus({ code: SpanStatusCode.OK })

      return result
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    } finally {
      span.end()
    }
  },

  /**
   * Wrap a synchronous operation in a span with automatic error handling.
   *
   * @param name - Span name
   * @param fn - Function to execute within the span
   * @returns The result of the function
   */
  withSpanSync<T>(name: string, fn: (span: Span) => T): T {
    const tracer = getTracer()
    const span = tracer.startSpan(name)

    try {
      const result = fn(span)
      span.setStatus({ code: SpanStatusCode.OK })

      return result
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      })

      throw error
    } finally {
      span.end()
    }
  },
}
