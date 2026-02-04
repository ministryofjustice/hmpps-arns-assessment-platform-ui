import { telemetry as baseTelemetry } from './client'
import { enrichSpanWithUser } from './helpers/enrichSpanWithUser'
import { filterSpanByPath } from './helpers/filterSpanByPath'
import { filterSpanWhereClient } from './helpers/filterSpanWhereClient'
import { renameSpanToHttpRoute } from './helpers/renameSpanToHttpRoute'
import { createSpanObfuscator } from './helpers/createSpanObfuscator'

/** Export types */
export { initialiseTelemetry, flushTelemetry, trace } from './TelemetryInitialiser'
export type { SpanInfo, SpanModifications, SpanProcessorFn } from './types/SpanProcessor'
export type { TelemetryConfig } from './types/TelemetryConfig'
export type { UserContext } from './types/UserContext'
export type { ObfuscationRule, ObfuscatorConfig } from './types/ObfuscatorConfig'
export { SpanKind } from '@opentelemetry/api'

/**
 * Telemetry library for Azure Application Insights with OpenTelemetry.
 *
 * IMPORTANT: Import this module FIRST before any other modules in your entry point.
 * OpenTelemetry needs to instrument modules (express, http, etc.) before they're loaded.
 *
 * @example
 * // In server.ts (must be first import)
 * import { initialiseTelemetry, flushTelemetry, telemetry } from './utils/telemetry'
 *
 * initialiseTelemetry({
 *   serviceName: 'my-service',
 *   serviceVersion: process.env.BUILD_NUMBER,
 *   connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
 * })
 *   .addSpanProcessor(telemetry.helpers.filterSpanWhereClient)
 *   .addSpanProcessor(telemetry.helpers.filterSpanByPath(['/health', '/ping']))
 *   .startRecording()
 *
 * // Handle shutdown
 * process.on('SIGTERM', async () => {
 *   await flushTelemetry()
 *   process.exit(0)
 * })
 *
 * // Then other imports...
 * import express from 'express'
 *
 * // Use telemetry anywhere in your code
 * import { telemetry } from './utils/telemetry'
 *
 * telemetry.setSpanAttributes({ 'custom.attribute': 'value' })
 * telemetry.addSpanEvent('UserLoggedIn', { userId })
 * telemetry.helpers.enrichSpanWithUser({ id: userId, authSource: 'nomis' })
 */
export const telemetry = {
  ...baseTelemetry,
  helpers: {
    enrichSpanWithUser,
    filterSpanByPath,
    filterSpanWhereClient,
    renameSpanToHttpRoute,
    createSpanObfuscator,
  },
}
