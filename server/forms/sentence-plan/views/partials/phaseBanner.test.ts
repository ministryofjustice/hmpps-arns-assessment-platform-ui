import nunjucks from 'nunjucks'

const template = 'sentence-plan/views/partials/phase-banner.njk'
const nationalRolloutFeedbackUrl = 'https://www.smartsurvey.co.uk/t/AAGPPN?service=ARNS%20Sentence%20Plan'

const nunjucksEnv = nunjucks.configure(
  ['server/forms', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

describe('phase banner', () => {
  it('uses the feedbackUrl to link to the feedback form', () => {
    const html = nunjucksEnv.render(template, {
      feedbackUrl: nationalRolloutFeedbackUrl,
    })

    expect(html).toContain(`href="${nationalRolloutFeedbackUrl}"`)
  })
})
