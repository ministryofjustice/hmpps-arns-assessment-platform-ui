import nunjucks from 'nunjucks'
import { getSessionTimeoutContent } from '../steps/session-timeout/sessionTimeoutContent'
import { sessionTimeoutStep } from '../steps/session-timeout/step'

const nunjucksEnv = nunjucks.configure(
  [
    'server/forms',
    'server/views',
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
    'node_modules/@ministryofjustice/hmpps-forge/dist/moj-components/',
  ],
  { autoescape: true },
)

nunjucksEnv.addFilter('assetMap', url => url)
nunjucksEnv.addGlobal('sessionTimeoutContentFor', getSessionTimeoutContent)

// Same values the app provides: the app-wide default header link and the step's static locals
const renderPage = (locals: Record<string, unknown>) =>
  nunjucksEnv.render('platform/views/session-timeout.njk', {
    hmppsHeaderServiceNameLink: '/sentence-plan/v1.0/plan/overview',
    footerBaseUrl: sessionTimeoutStep.view?.locals?.footerBaseUrl,
    hideSessionTimeoutModal: true,
    ...locals,
  })

describe('session-timeout.njk', () => {
  describe('render()', () => {
    it('should render Sentence Plan wording, button and footer when the service is sentence-plan', () => {
      // Act
      const html = renderPage({ timedOutService: 'sentence-plan' })

      // Assert
      expect(html).toContain('<title>Your unsaved information has been deleted - Sentence plan</title>')
      expect(html).toContain('<h1 class="govuk-heading-l">Your unsaved information has been deleted</h1>')
      expect(html).toContain('You can go to the plan to start again.')
      expect(html).toContain('href="/sentence-plan/v1.0/plan/overview"')
      expect(html).toContain('Go to the plan')
      expect(html).toContain('data-ai-id="accessibility-link" href="/platform/accessibility"')
    })

    it('should link to the OASys handover sign-in when the user signed in through OASys', () => {
      // Act
      const html = renderPage({ timedOutService: 'strengths-and-needs', timedOutAuthSource: 'OASYS' })

      // Assert
      expect(html).toContain('href="/sign-in/handover?service=strengths-and-needs"')
    })

    it('should render Strengths and needs wording with the shared footer when the service is strengths-and-needs', () => {
      // Act
      const html = renderPage({ timedOutService: 'strengths-and-needs' })

      // Assert
      expect(html).toContain('<h1 class="govuk-heading-l">Your session has ended</h1>')
      expect(html).toContain('Your information has been saved.')
      expect(html).toContain('href="/strengths-and-needs"')
      expect(html).not.toContain('data-ai-id="accessibility-link"')
    })

    it('should link the header to the service when the service is strengths-and-needs', () => {
      // Act
      const html = renderPage({ timedOutService: 'strengths-and-needs' })

      // Assert
      expect(html).toContain('data-ai-id="hmpps-arns-header-link" href="/strengths-and-needs"')
    })

    it('should link the footer to the shared platform policy pages when the service is strengths-and-needs', () => {
      // Act
      const html = renderPage({ timedOutService: 'strengths-and-needs' })

      // Assert
      expect(html).toContain('href="/platform/accessibility"')
      expect(html).toContain('href="/platform/cookies-policy"')
    })

    it('should render default wording without a return button when the service is unknown', () => {
      // Act
      const html = renderPage({ timedOutService: '<script>alert(1)</script>', timedOutAuthSource: 'OASYS' })

      // Assert
      expect(html).toContain('<title>Your session has ended - Assess and plan</title>')
      expect(html).not.toContain('/sign-in/handover')
      expect(html).not.toContain('data-ai-id="hmpps-arns-header-link"')
      expect(html).not.toContain('/sentence-plan/v1.0/plan/overview')
      expect(html).not.toContain('<script>alert(1)</script>')
    })
  })
})
