import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

const connectionString = document.querySelector('meta[name="ai-connection-string"]')?.content

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

  instance.startTrackPage()

  // stop the page visit timer and flush telemetry before the page unloads:
  // in an MPA, the JS context is destroyed on navigation, so without this
  // the last page of a session would never have its visit duration recorded
  window.addEventListener('pagehide', () => {
    instance.stopTrackPage()
    instance.flush()
  })

  return instance
}

export const appInsights = createAppInsights()

const accordionNames = {
  'high-scoring-areas-accordion': 'High scoring areas',
  'low-scoring-areas-accordion': 'Low scoring areas',
  'incomplete-areas-accordion': 'Incomplete areas',
  'other-areas-accordion': 'Areas without a need score',
  'plan-history-accordion': 'Plan history',
}

const accordionConfigs = [
  // About page
  {
    selector: '.about-page-accordion .govuk-accordion',
    showAllId: 'san-info-accordion',
    sectionId: 'san-info-area-of-need-accordion',
  },
  // Plan History page
  {
    selector: '#plan-history-accordion',
    showAllId: 'plan-history-accordion-show-all',
    sectionId: 'plan-history-accordion-content',
  },
]

function initialiseAccordion(accordion, config) {
  const accordionId = accordion.id
  const accordionName = accordionNames[accordionId] || accordionId

  const showAllButton = accordion.querySelector('.govuk-accordion__show-all')

  if (showAllButton) {
    showAllButton.setAttribute('data-ai-id', config.showAllId)
    showAllButton.setAttribute('data-ai-accordionname', accordionName)
    showAllButton.setAttribute('data-ai-controltype', 'AccordionHeader')
    showAllButton.setAttribute('data-ai-action', 'Expand all')

    showAllButton.addEventListener('click', () => {
      const isExpanded = showAllButton.getAttribute('aria-expanded') === 'true'

      showAllButton.setAttribute('data-ai-action', isExpanded ? 'Expand all' : 'Collapse all')
    })
  }

  accordion.querySelectorAll('.govuk-accordion__section')
    .forEach((section, index) => {
      const showSectionbutton = section.querySelector('.govuk-accordion__section-button')

      if (!showSectionbutton) return

      const itemName = showSectionbutton
        .querySelector('.govuk-accordion__section-heading-text-focus')
        ?.textContent?.trim()

      showSectionbutton.setAttribute('data-ai-id', config.sectionId)
      showSectionbutton.setAttribute('data-ai-accordionname', accordionName)
      if (itemName) showSectionbutton.setAttribute('data-ai-itemname', itemName)
      showSectionbutton.setAttribute('data-ai-index', String(index + 1))
      showSectionbutton.setAttribute('data-ai-controltype', 'Item')
      showSectionbutton.setAttribute('data-ai-action', 'Expand')

      showSectionbutton.addEventListener('click', () => {
        const isExpanded = showSectionbutton.getAttribute('aria-expanded') === 'true'

        showSectionbutton.setAttribute('data-ai-action', isExpanded ? 'Expand' : 'Collapse')
      })
    })
}

export function initAccordionTelemetry() {
  if (!connectionString) return

  accordionConfigs.forEach(config => {
    document.querySelectorAll(config.selector)
      .forEach(accordion => {
        initialiseAccordion(accordion, config)
      })
  })
}
