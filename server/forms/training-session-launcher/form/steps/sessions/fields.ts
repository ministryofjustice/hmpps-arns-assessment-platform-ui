import { Data, Item, Iterator, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKButton, GovUKDetails, GovUKLinkButton, GovUKSelectInput } from '@form-engine-govuk-components/components'
import { MOJAlert } from '@form-engine-moj-components/components'
import { scenarioDetailsBlock } from '../../blocks/scenarioDetailsBlock'
import { TrainingSessionLauncherTransformers } from '../../../transformers'

/**
 * Notification banners - renders any flash notifications from session using MOJ Alert
 */
export const notificationBanners = CollectionBlock({
  collection: Data('notifications').each(
    Iterator.Map(
      MOJAlert({
        alertVariant: Item().path('type'),
        title: Item().path('title'),
        text: Item().path('message'),
        showTitleAsHeading: true,
      }),
    ),
  ),
})

/**
 * API failure error banner
 */
export const errorBanner = HtmlBlock({
  hidden: Data('handoverApiFailure').not.match(Condition.Equals(true)),
  content: `
    <div class="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 class="govuk-error-summary__title">There is a problem</h2>
        <div class="govuk-error-summary__body">
          <p class="govuk-body">Failed to generate handover link. Please try again.</p>
        </div>
      </div>
    </div>
  `,
})

/**
 * Page heading with caption
 */
export const pageHeading = HtmlBlock({
  content: `
    <span class="govuk-caption-l">Training</span>
    <h1 class="govuk-heading-l">Active sessions</h1>
  `,
})

/**
 * Help text explaining what this page is for
 */
export const pageHelpText = GovUKDetails({
  summaryText: 'What is this page for?',
  content: [
    HtmlBlock({
      content: `
        <p class="govuk-body">
          This page shows all your active training sessions. Each session represents a case study
          you can use to practice assessments.
        </p>
        <p class="govuk-body">
          For each session, select a target service and click <strong>Generate link</strong> to
          open the assessment. Use <strong>Delete session</strong> to remove individual sessions,
          or <strong>Reset all sessions</strong> to clear everything and start fresh.
        </p>
      `,
    }),
  ],
})

/**
 * No sessions message
 */
export const noSessionsMessage = HtmlBlock({
  hidden: Data('sessions').match(Condition.IsRequired()),
  content: `
    <div class="govuk-inset-text">
      <p class="govuk-body">You don't have any active training sessions.</p>
      <p class="govuk-body">
        <a href="browse" class="govuk-link">Select a scenario</a> to create a new session.
      </p>
    </div>
  `,
})

/**
 * Fallback message when sessions list is empty
 */
export const noSessionsFallback = HtmlBlock({
  content: '<p class="govuk-body">No sessions to display.</p>',
})

/**
 * Session card block template
 * Uses native <details> element for accordion-style expand/collapse.
 * First session (index 0) is expanded by default.
 */
export const sessionCardBlock = TemplateWrapper({
  classes: 'session-card',
  template: `
    <details class="session-card__details" {{openAttr}}>
      <summary class="session-card__summary">
        <span class="session-card__title">{{scenarioName}}</span>
        <span class="session-card__subtitle">{{givenName}} {{familyName}} &bull; {{crn}} &bull; {{location}}</span>
        <span class="session-card__meta">{{createdAt}}</span>
      </summary>
      <div class="session-card__content">
        {{slot:details}}
        <form method="post" novalidate class="session-card__actions">
          <input type="hidden" name="_csrf" value="{{csrfToken}}">
          <input type="hidden" name="trainingSessionId" value="{{sessionId}}">
          {{slot:actions}}
        </form>
      </div>
    </details>
  `,
  values: {
    csrfToken: Data('csrfToken'),
    sessionId: Item().path('id'),
    scenarioName: Item().path('scenarioName'),
    givenName: Item().path('givenName'),
    familyName: Item().path('familyName'),
    crn: Item().path('crn'),
    location: Item().path('location'),
    createdAt: Item().path('createdAt').pipe(TrainingSessionLauncherTransformers.RelativeTime()),
    openAttr: when(Item().index().match(Condition.Equals(0)))
      .then('open')
      .else(''),
  },
  slots: {
    details: [
      GovUKDetails({
        summaryText: 'View scenario details',
        content: [scenarioDetailsBlock],
      }),
    ],
    actions: [
      GovUKSelectInput({
        code: 'targetApplication',
        label: { text: 'Target service', classes: 'govuk-!-font-weight-bold' },
        items: Item().path('availableServices'),
      }),

      GovUKButton({
        text: 'Generate link',
        name: 'action',
        value: 'generateLink',
      }),

      GovUKButton({
        text: 'Delete session',
        name: 'action',
        value: 'deleteSession',
        classes: 'govuk-button--secondary',
      }),
    ],
  },
})

/**
 * Sessions list using CollectionBlock
 */
export const sessionsList = CollectionBlock({
  hidden: Data('sessions').not.match(Condition.IsRequired()),
  collection: Data('sessions').each(Iterator.Map(sessionCardBlock)),
  fallback: [noSessionsFallback],
})

/**
 * Section break before new session button
 */
export const sectionBreak = HtmlBlock({
  content: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
})

/**
 * New session button
 */
export const newSessionButton = GovUKLinkButton({
  text: '+ New session',
  href: 'browse',
  classes: 'govuk-button--secondary',
})

/**
 * Reset all sessions form
 */
export const resetAllSessionsForm = TemplateWrapper({
  hidden: Data('sessions').not.match(Condition.IsRequired()),
  template: `
    <form method="post" novalidate>
      <input type="hidden" name="_csrf" value="{{csrfToken}}">
      {{slot:button}}
    </form>
  `,
  values: {
    csrfToken: Data('csrfToken'),
  },
  slots: {
    button: [
      GovUKButton({
        text: 'Reset all sessions',
        name: 'action',
        value: 'resetAllSessions',
        classes: 'govuk-button--warning',
      }),
    ],
  },
})
