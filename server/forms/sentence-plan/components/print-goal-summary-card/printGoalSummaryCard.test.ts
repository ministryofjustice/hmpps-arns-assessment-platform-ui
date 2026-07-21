import nunjucks from 'nunjucks'
import { StructureType } from '@ministryofjustice/hmpps-forge/core/authoring'
import { EvaluatedBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { PrintGoalSummaryCardDefinition, printGoalSummaryCard } from './printGoalSummaryCard'

const nunjucksEnv = nunjucks.configure(
  ['server/views', 'server/forms', 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

describe('print goal summary card', () => {
  it('renders the print-only goal and step layout', async () => {
    const html = await printGoalSummaryCard.render(
      {
        type: StructureType.BLOCK,
        variant: 'printGoalSummaryCard',
        goalTitle: 'Find somewhere suitable to live',
        goalStatus: 'ACTIVE',
        targetDate: '20 December 2026',
        areaOfNeed: 'Accommodation',
        relatedAreasOfNeed: ['Thinking, behaviours and attitudes'],
        steps: [
          { actor: 'Probation practitioner', description: 'Find accommodation advice', status: 'COMPLETED' },
          { actor: 'Joan', description: 'Follow the approved premises rules', status: 'IN_PROGRESS' },
        ],
      } as EvaluatedBlock<PrintGoalSummaryCardDefinition>,
      nunjucksEnv,
    )

    expect(html).toContain('class="print-goal-summary-card"')
    expect(html).toContain('<h3 class="govuk-summary-card__title"')
    expect(html).toContain('<strong>Steps</strong> – 1 of 2 completed')
    expect(html).not.toContain('<th')
    expect(html).not.toContain('Who will do this')
    expect(html.indexOf('Find accommodation advice')).toBeLessThan(html.indexOf('Probation practitioner will do this'))
    expect(html).toContain('Area of need: accommodation')
    expect(html).toContain('Also relates to: thinking, behaviours and attitudes')
  })
})
