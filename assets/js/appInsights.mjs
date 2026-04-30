import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

const connectionString = document.querySelector('meta[name="ai-connection-string"]')?.content

if (connectionString) {
  const clickAnalyticsPlugin = new ClickAnalyticsPlugin()

  const clickAnalyticsConfig = {
    autoCapture: true,
    dropInvalidEvents: true,
    trackElementTypes: 'A,BUTTON,AREA,INPUT,SUMMARY',
    dataTags: {
      customDataPrefix: 'data-ai-',
      useDefaultContentNameOrId: false,
    },
  }

  const appInsights = new ApplicationInsights({
    config: {
      connectionString,
      disableXhr: true,
      isBeaconApiDisabled: false,
      blkCdnCfg: true,
      autoTrackPageVisitTime: false,
      extensions: [clickAnalyticsPlugin],
      extensionConfig: {
        [clickAnalyticsPlugin.identifier]: clickAnalyticsConfig,
      },
    },
  })

  appInsights.loadAppInsights()

  appInsights.addTelemetryInitializer(envelope => {
    const assessmentUuid = document.querySelector('[data-qa-assessment-uuid]')?.getAttribute('data-qa-assessment-uuid')
    const requestId = document.querySelector('meta[name="ai-request-id"]')?.content
    const telemetryId = document.querySelector('meta[name="ai-telemetry-id"]')?.content
    const entryPoint = document.querySelector('meta[name="ai-entry-point"]')?.content
    const userType = document.querySelector('meta[name="ai-user-type"]')?.content
    const goalsActive = document.querySelector('meta[name="ai-goals-active"]')?.content
    const goalsFuture = document.querySelector('meta[name="ai-goals-future"]')?.content
    const goalsAchieved = document.querySelector('meta[name="ai-goals-achieved"]')?.content
    const goalsRemoved = document.querySelector('meta[name="ai-goals-removed"]')?.content
    const goalsTotal = document.querySelector('meta[name="ai-goals-total"]')?.content
    const stepsTotal = document.querySelector('meta[name="ai-steps-total"]')?.content

    envelope.tags['ai.cloud.role'] = 'hmpps-arns-assessment-platform-ui'

    envelope.data = {
      ...envelope.data,
      assessmentUuid: assessmentUuid || undefined,
      requestId: requestId || undefined,
      telemetryId: telemetryId || undefined,
      entryPoint: entryPoint || undefined,
      userType: userType || undefined,
      goalsActive: goalsActive || undefined,
      goalsFuture: goalsFuture || undefined,
      goalsAchieved: goalsAchieved || undefined,
      goalsRemoved: goalsRemoved || undefined,
      goalsTotal: goalsTotal || undefined,
      stepsTotal: stepsTotal || undefined,
    }
  })

  appInsights.startTrackPage()

  // stop the page visit timer and flush telemetry before the page unloads:
  // in an MPA, the JS context is destroyed on navigation, so without this
  // the last page of a session would never have its visit duration recorded
  window.addEventListener('pagehide', () => {
    appInsights.stopTrackPage()
    appInsights.flush()
  })
}
