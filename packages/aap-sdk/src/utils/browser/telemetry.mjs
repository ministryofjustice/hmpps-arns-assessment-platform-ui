const telemetryEventName = 'aap:track-event'

/**
 * @typedef {object} BrowserTelemetryEvent
 * @property {string} name
 * @property {Record<string, unknown>} [properties]
 */

export const browserTelemetry = {
  /** @param {BrowserTelemetryEvent} event */
  trackEvent(event) {
    document.dispatchEvent(new CustomEvent(telemetryEventName, { detail: event }))
  },

  /** @param {(event: BrowserTelemetryEvent) => void} listener */
  subscribe(listener) {
    document.addEventListener(telemetryEventName, event => {
      if (event instanceof CustomEvent) {
        listener(event.detail)
      }
    })
  },
}
