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
    const entryPoint = document.querySelector('meta[name="ai-entry-point"]')?.content
    const userType = document.querySelector('meta[name="ai-user-type"]')?.content

    envelope.tags['ai.cloud.role'] = 'hmpps-arns-assessment-platform-ui'

    envelope.data = {
      ...envelope.data,
      assessmentUuid: assessmentUuid || undefined,
      requestId: requestId || undefined,
      entryPoint: entryPoint || undefined,
      userType: userType || undefined,
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
