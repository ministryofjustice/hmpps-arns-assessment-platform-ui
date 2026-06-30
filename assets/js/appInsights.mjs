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
    const userContext = document.querySelector('meta[name="ai-user-context"]')?.content
    const userType = document.querySelector('meta[name="ai-user-type"]')?.content
    const goalsActive = document.querySelector('meta[name="ai-goals-active"]')?.content
    const goalsFuture = document.querySelector('meta[name="ai-goals-future"]')?.content
    const goalsAchieved = document.querySelector('meta[name="ai-goals-achieved"]')?.content
    const goalsRemoved = document.querySelector('meta[name="ai-goals-removed"]')?.content
    const goalsTotal = document.querySelector('meta[name="ai-goals-total"]')?.content
    const stepsTotal = document.querySelector('meta[name="ai-steps-total"]')?.content
    const goalsWithMultipleSteps = document.querySelector('meta[name="ai-goals-with-multiple-steps"]')?.content
    const stepsPersonOnProbation = document.querySelector('meta[name="ai-steps-person-on-probation"]')?.content
    const stepsProbationPractitioner = document.querySelector('meta[name="ai-steps-probation-practitioner"]')?.content
    const stepsPrisonOffenderManager = document.querySelector('meta[name="ai-steps-prison-offender-manager"]')?.content
    const stepsProgrammeStaff = document.querySelector('meta[name="ai-steps-programme-staff"]')?.content
    const stepsPartnershipAgency = document.querySelector('meta[name="ai-steps-partnership-agency"]')?.content
    const stepsCrsProvider = document.querySelector('meta[name="ai-steps-crs-provider"]')?.content
    const stepsSomeoneElse = document.querySelector('meta[name="ai-steps-someone-else"]')?.content

    envelope.tags['ai.cloud.role'] = 'hmpps-arns-assessment-platform-ui'

    envelope.data = {
      ...envelope.data,
      assessmentUuid: assessmentUuid || undefined,
      requestId: requestId || undefined,
      telemetryId: telemetryId || undefined,
      entryPoint: entryPoint || undefined,
      userContext: userContext || undefined,
      userType: userType || undefined,
      goalsActive: goalsActive || undefined,
      goalsFuture: goalsFuture || undefined,
      goalsAchieved: goalsAchieved || undefined,
      goalsRemoved: goalsRemoved || undefined,
      goalsTotal: goalsTotal || undefined,
      stepsTotal: stepsTotal || undefined,
      goalsWithMultipleSteps: goalsWithMultipleSteps || undefined,
      stepsPersonOnProbation: stepsPersonOnProbation || undefined,
      stepsProbationPractitioner: stepsProbationPractitioner || undefined,
      stepsPrisonOffenderManager: stepsPrisonOffenderManager || undefined,
      stepsProgrammeStaff: stepsProgrammeStaff || undefined,
      stepsPartnershipAgency: stepsPartnershipAgency || undefined,
      stepsCrsProvider: stepsCrsProvider || undefined,
      stepsSomeoneElse: stepsSomeoneElse || undefined,
    }
  })

  const accordionNames = {
    'high-scoring-areas-accordion': 'High scoring areas',
    'low-scoring-areas-accordion': 'Low scoring areas',
    'incomplete-areas-accordion': 'Incomplete areas',
    'other-areas-accordion': 'Areas without a need score',
  }

  // About page accordion: Show all/Hide all sections
  document.querySelectorAll('.about-page-accordion .govuk-accordion__show-all').forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true'
      const accordionId = button.closest('.govuk-accordion')?.id
      const accordionName = accordionNames[accordionId] || accordionId

      appInsights.trackEvent({
        name: 'san-info-accordion',
        properties: {
          AccordionName: accordionName,
          Action: isExpanded ? 'Expand all' : 'Collapse all',
          ControlType: 'AccordionHeader',
        },
      })
    })
  })

  // About page accordion: individual sections
  document.querySelectorAll('.about-page-accordion .govuk-accordion__section').forEach((section, index) => {
    const button = section.querySelector('.govuk-accordion__section-button')
    if (!button) return

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true'
      const itemName = button.querySelector('.govuk-accordion__section-heading-text-focus')?.textContent?.trim()
      const accordionId = section.closest('.govuk-accordion')?.id
      const accordionName = accordionNames[accordionId] || accordionId

      appInsights.trackEvent({
        name: 'san-info-area-of-need-accordion',
        properties: {
          AccordionName: accordionName,
          ItemName: itemName,
          Index: String(index + 1),
          Action: isExpanded ? 'Expand' : 'Collapse',
          ControlType: 'Item',
        },
      })
    })
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
