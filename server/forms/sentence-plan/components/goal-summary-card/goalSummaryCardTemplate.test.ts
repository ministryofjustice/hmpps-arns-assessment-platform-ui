import nunjucks from 'nunjucks'

const nunjucksEnv = nunjucks.configure(['server/forms', 'node_modules/govuk-frontend/dist/'], { autoescape: true })

describe('goal summary card templates', () => {
  it.each(['agreed', 'draft'])('does not render a blank data-ai-id on an untagged %s button', template => {
    const html = nunjucksEnv.render(`sentence-plan/components/goal-summary-card/${template}.njk`, {
      params: {
        goalTitle: 'Goal',
        actions: [],
        buttons: [{ text: 'Continue', href: '/continue' }],
        steps: [],
        stepsCount: 0,
        areaOfNeed: 'Finances',
      },
    })

    expect(html).toContain('href="/continue"')
    expect(html).not.toContain('data-ai-id=""')
    expect(html).not.toContain('data-ai-id="undefined"')
  })

  it('does not render a blank data-ai-id on an untagged action link', () => {
    const html = nunjucksEnv.renderString(
      '{% import "sentence-plan/components/goal-summary-card/_macros.njk" as card %}{{ card.actionLink(action, "") }}',
      { action: { text: 'Change', href: '/change' } },
    )

    expect(html).not.toContain('data-ai-id')
  })
})
