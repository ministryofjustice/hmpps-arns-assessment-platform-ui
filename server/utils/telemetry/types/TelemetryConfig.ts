import type bunyan from 'bunyan'

/**
 * Configuration for telemetry initialisation.
 */
export interface TelemetryConfig {
  /** Service name reported in telemetry */
  serviceName: string

  /** Service version (e.g., build number) */
  serviceVersion?: string

  /** Logger instance for telemetry messages. Defaults to console. */
  logger: bunyan | Console

  /**
   * Azure Application Insights connection string.
   * If not provided, telemetry will only be logged to console when debug is true.
   */
  connectionString?: string

  /**
   * Enable debug mode - logs spans to console.
   * Works with or without a connection string.
   */
  debug?: boolean
}
