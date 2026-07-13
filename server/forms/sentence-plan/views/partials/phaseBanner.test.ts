import nunjucks from 'nunjucks'

const template = 'sentence-plan/views/partials/phase-banner.njk'
const privateBetaFeedbackUrl = 'https://forms.office.com/private-beta-feedback'
const nationalRolloutFeedbackUrl = 'https://www.smartsurvey.co.uk/t/AAGPPN?service=ARNS%20Sentence%20Plan'

const nunjucksEnv = nunjucks.configure(
  ['server/forms', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

describe('phase banner', () => {
  it('uses the national rollout feedback URL when the user cohort is unknown', () => {
    const html = nunjucksEnv.render(template, {
      feedbackFormUrl: privateBetaFeedbackUrl,
      nationalRolloutFeedbackUrl,
    })

    expect(html).toContain(`href="${nationalRolloutFeedbackUrl}"`)
    expect(html).not.toContain(`href="${privateBetaFeedbackUrl}"`)
  })

  it('uses the supplied user feedback URL for a private beta user', () => {
    const html = nunjucksEnv.render(template, {
      userFeedbackUrl: privateBetaFeedbackUrl,
      nationalRolloutFeedbackUrl,
    })

    expect(html).toContain(`href="${privateBetaFeedbackUrl}"`)
    expect(html).not.toContain(`href="${nationalRolloutFeedbackUrl}"`)
  })
})
