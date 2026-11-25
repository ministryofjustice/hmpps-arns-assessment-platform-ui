import nunjucks from 'nunjucks'
import { getSessionTimeoutContent } from '../../forms/platform/steps/session-timeout/sessionTimeoutContent'

const nunjucksEnv = nunjucks.configure(['server/views'], { autoescape: true })

nunjucksEnv.addGlobal('sessionTimeoutContentFor', getSessionTimeoutContent)

const renderModal = (locals: Record<string, unknown>) =>
  nunjucksEnv.render('partials/session-timeout-modal.njk', {
    sessionTimeoutConfig: { warningAfterInactiveSeconds: 3000, countdownSeconds: 600 },
    ...locals,
  })

describe('session-timeout-modal.njk', () => {
  describe('render()', () => {
    it('should pass Sentence Plan wording and redirect when the user is in sentence-plan', () => {
      // Act
      const html = renderModal({ targetService: 'sentence-plan' })

      // Assert
      expect(html).toContain('data-timeout-redirect-url="/platform/session-timeout?service=sentence-plan"')
      expect(html).toContain('data-heading="Your unsaved information will be deleted soon"')
      expect(html).toContain('data-continue-text="Continue using sentence plan"')
      expect(html).toContain('data-leave-text="Delete unsaved information"')
    })

    it('should pass Strengths and needs wording and redirect when the user is in strengths-and-needs', () => {
      // Act
      const html = renderModal({ targetService: 'strengths-and-needs' })

      // Assert
      expect(html).toContain('data-timeout-redirect-url="/platform/session-timeout?service=strengths-and-needs"')
      expect(html).toContain('data-continue-text="Continue using strengths and needs"')
    })

    it('should pass default wording and no service when the user is not in a known service', () => {
      // Act
      const html = renderModal({})

      // Assert
      expect(html).toContain('data-timeout-redirect-url="/platform/session-timeout"')
      expect(html).toContain('data-continue-text="Continue"')
    })
  })
})
