import { initialiseTelemetry, flushTelemetry, telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { requestContext } from './requestContext'

// wrap telemetry.trackEvent so every server-side custom event automatically
// includes serviceName from the current request context (AsyncLocalStorage).
// covers the customEvents table in appInsights
const originalTrackEvent = telemetry.trackEvent.bind(telemetry)
telemetry.trackEvent = (name: string, attributes?: Record<string, string | number | boolean>) => {
  const context = requestContext.getStore()

  const serviceName = context?.getServiceName()

  originalTrackEvent(name, {
    ...attributes,
    ...(serviceName ? { serviceName } : {}),
  })
}

initialiseTelemetry({
  serviceName: 'hmpps-arns-assessment-platform-ui',
  serviceVersion: process.env.BUILD_NUMBER || 'unknown',
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  debug: process.env.DEBUG_TELEMETRY === 'true',
})
  .addFilter(telemetry.processors.filterSpanWherePath(['/health', '/ping', '/info', '/assets/*', '/favicon.ico']))
  .addModifier(telemetry.processors.enrichSpanNameWithHttpRoute())
  .addModifier(span => {
    const serviceName = requestContext.getStore()?.getServiceName()

    if (serviceName) {
      span.setAttribute('serviceName', serviceName)
    }
  })
  .startRecording()

const shutdown = async () => {
  await flushTelemetry()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown())
process.on('SIGINT', () => shutdown())
