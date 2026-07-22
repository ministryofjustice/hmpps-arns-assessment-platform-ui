import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

const connectionString = document.querySelector('meta[name="ai-connection-string"]')?.content

const readMetaContent = name => document.querySelector(`meta[name="${name}"]`)?.content || undefined

const readTelemetryContext = () => ({
  assessmentUuid:
    document.querySelector('[data-qa-assessment-uuid]')?.getAttribute('data-qa-assessment-uuid') || undefined,
  requestId: readMetaContent('ai-request-id'),
  telemetryId: readMetaContent('ai-telemetry-id'),
  entryPoint: readMetaContent('ai-entry-point'),
  userContext: readMetaContent('ai-user-context'),
  userType: readMetaContent('ai-user-type'),
  goalsActive: readMetaContent('ai-goals-active'),
  goalsFuture: readMetaContent('ai-goals-future'),
  goalsAchieved: readMetaContent('ai-goals-achieved'),
  goalsRemoved: readMetaContent('ai-goals-removed'),
  goalsTotal: readMetaContent('ai-goals-total'),
  stepsTotal: readMetaContent('ai-steps-total'),
  goalsWithMultipleSteps: readMetaContent('ai-goals-with-multiple-steps'),
  stepsPersonOnProbation: readMetaContent('ai-steps-person-on-probation'),
  stepsProbationPractitioner: readMetaContent('ai-steps-probation-practitioner'),
  stepsPrisonOffenderManager: readMetaContent('ai-steps-prison-offender-manager'),
  stepsProgrammeStaff: readMetaContent('ai-steps-programme-staff'),
  stepsPartnershipAgency: readMetaContent('ai-steps-partnership-agency'),
  stepsCrsProvider: readMetaContent('ai-steps-crs-provider'),
  stepsSomeoneElse: readMetaContent('ai-steps-someone-else'),
})

function createAppInsights() {
  if (!connectionString) return null

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

  const instance = new ApplicationInsights({
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

  instance.loadAppInsights()

  instance.addTelemetryInitializer(envelope => {
    envelope.tags['ai.cloud.role'] = 'hmpps-arns-assessment-platform-ui'

    envelope.data = {
      ...envelope.data,
      ...readTelemetryContext(),
    }
  })

  instance.startTrackPage()

  /*
   * A multi-page app destroys its JavaScript during navigation. Flush before
   * unload or the final page duration would be lost.
   */
  window.addEventListener('pagehide', () => {
    instance.stopTrackPage()
    instance.flush()
  })

  return instance
}

export const appInsights = createAppInsights()
