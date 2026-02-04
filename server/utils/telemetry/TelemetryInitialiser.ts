import { metrics, trace } from '@opentelemetry/api'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'
import { useAzureMonitor, AzureMonitorOpenTelemetryOptions } from '@azure/monitor-opentelemetry'
import type { TelemetryConfig } from './types/TelemetryConfig'
import type { SpanProcessorFn } from './types/SpanProcessor'
import { FilteringSpanProcessor } from './FilteringSpanProcessor'
import { getLogger, setConfig } from './config'

export interface TelemetryBuilder {
  addSpanProcessor(processor: SpanProcessorFn): TelemetryBuilder
  startRecording(): void
}

/**
 * Flush pending telemetry and shut down the provider.
 * Call this during application shutdown to ensure all telemetry is sent.
 */
export async function flushTelemetry(): Promise<void> {
  const logger = getLogger()

  logger.info('Telemetry: Flushing telemetry...')

  try {
    const provider = trace.getTracerProvider()

    if ('forceFlush' in provider && typeof provider.forceFlush === 'function') {
      await provider.forceFlush()
    }

    if ('shutdown' in provider && typeof provider.shutdown === 'function') {
      await provider.shutdown()
    }

    logger.info('Telemetry: Flush complete')
  } catch (error) {
    logger.error(error, 'Telemetry: Error during flush')
  }
}

function initialiseWithAzureMonitor(config: TelemetryConfig, processors: SpanProcessorFn[]): void {
  const logger = getLogger()

  logger.info(`Telemetry: Initialising Azure Monitor for ${config.serviceName}`)

  const spanProcessors = []

  if (config.debug) {
    logger.info('Telemetry: Debug mode enabled - spans will be logged to console')
    spanProcessors.push(new FilteringSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()), processors))
  }

  const options: AzureMonitorOpenTelemetryOptions = {
    azureMonitorExporterOptions: {
      connectionString: config.connectionString,
    },
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: config.serviceName,
      [ATTR_SERVICE_VERSION]: config.serviceVersion || 'unknown',
    }),
    instrumentationOptions: {
      bunyan: { enabled: true },
    },
    spanProcessors,
  }

  useAzureMonitor(options)

  registerInstrumentations({
    tracerProvider: trace.getTracerProvider(),
    meterProvider: metrics.getMeterProvider(),
    instrumentations: [
      new ExpressInstrumentation({
        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.ROUTER, ExpressLayerType.REQUEST_HANDLER],
      }),
    ],
  })
}

function initialiseDebugOnly(config: TelemetryConfig, processors: SpanProcessorFn[]): void {
  getLogger().info(`Telemetry: Debug mode only for ${config.serviceName} - spans will be logged to console`)

  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: config.serviceName,
      [ATTR_SERVICE_VERSION]: config.serviceVersion || 'unknown',
    }),
    spanProcessors: [new FilteringSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()), processors)],
  })

  provider.register()

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation({
        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.ROUTER, ExpressLayerType.REQUEST_HANDLER],
      }),
    ],
  })
}

/**
 * Initialise telemetry for the application.
 *
 * IMPORTANT: Call this at the very top of your entry point, before any other imports.
 *
 * @param config - Telemetry configuration
 * @returns A builder to configure span processors and start recording
 *
 * @example
 * initialiseTelemetry({
 *   serviceName: 'my-service',
 *   serviceVersion: process.env.BUILD_NUMBER,
 *   connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
 *   logger: logger,
 * })
 *   .addSpanProcessor(helpers.filterSpanWhereClient)
 *   .addSpanProcessor(helpers.filterSpanByPath(['/health', '/ping']))
 *   .startRecording()
 */
export function initialiseTelemetry(config: TelemetryConfig): TelemetryBuilder {
  setConfig(config)

  const processors: SpanProcessorFn[] = []

  return {
    addSpanProcessor(processor: SpanProcessorFn): TelemetryBuilder {
      processors.push(processor)
      return this
    },

    startRecording(): void {
      if (config.connectionString) {
        initialiseWithAzureMonitor(config, processors)
      } else if (config.debug) {
        initialiseDebugOnly(config, processors)
      } else {
        getLogger().info('Telemetry: No connection string and debug disabled - telemetry not initialised')
      }
    },
  }
}

export { trace }
