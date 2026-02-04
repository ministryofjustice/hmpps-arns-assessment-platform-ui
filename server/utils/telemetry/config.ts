import type Logger from 'bunyan'
import type { TelemetryConfig } from './types/TelemetryConfig'

let config: TelemetryConfig | null = null

export function setConfig(telemetryConfig: TelemetryConfig): void {
  config = telemetryConfig
}

export function getConfig(): TelemetryConfig | null {
  return config
}

export function getLogger(): Logger | Console {
  return config?.logger ?? console
}
