import nunjucks from 'nunjucks'
import { StructureType } from '@form-engine/form/types/enums'
import { EvaluatedBlock } from '@form-engine/form/types/structures.type'
import {
  GoalSummaryCardAgreed,
  GoalSummaryCardDraft,
  GoalSummaryCardHistory,
  GoalAction,
  GoalStep,
  goalSummaryCardAgreed,
  goalSummaryCardDraft,
  goalSummaryCardHistory,
} from './goalSummaryCard'

const nunjucksEnv = nunjucks.configure(
  [
    'server/views',
    'server/forms',
    'packages/form-engine-moj-components/src/',
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
  ],
  { autoescape: true },
)

describe('goal summary card', () => {
  const baseBlock = {
    type: StructureType.BLOCK,
    goalTitle: 'My goal',
    goalStatus: 'ACTIVE',
    areaOfNeed: 'Accommodation',
    relatedAreasOfNeed: ['Employment and education', 'Finances'],
    steps: [] as GoalStep[],
    actions: [] as GoalAction[],
  }

  it('renders capitalised area of need labels on agreed cards', async () => {
    const html = await goalSummaryCardAgreed.render(
      {
        ...baseBlock,
        variant: 'goalSummaryCardAgreed',
      } as EvaluatedBlock<GoalSummaryCardAgreed>,
      nunjucksEnv,
    )

    expect(html).toContain('Area of need: Accommodation')
    expect(html).toContain('Also linked to: Employment and education; Finances')
  })

  it('renders capitalised area of need labels on draft cards', async () => {
    const html = await goalSummaryCardDraft.render(
      {
        ...baseBlock,
        variant: 'goalSummaryCardDraft',
      } as EvaluatedBlock<GoalSummaryCardDraft>,
      nunjucksEnv,
    )

    expect(html).toContain('Area of need: Accommodation')
    expect(html).toContain('Also linked to: Employment and education; Finances')
  })

  it('renders capitalised area of need labels on history cards', async () => {
    const html = await goalSummaryCardHistory.render(
      {
        ...baseBlock,
        variant: 'goalSummaryCardHistory',
      } as EvaluatedBlock<GoalSummaryCardHistory>,
      nunjucksEnv,
    )

    expect(html).toContain('Area of need: Accommodation')
    expect(html).toContain('Also relates to: Employment and education; Finances')
  })

  it('uses "out of" wording for agreed card step counters', async () => {
    const html = await goalSummaryCardAgreed.render(
      {
        ...baseBlock,
        variant: 'goalSummaryCardAgreed',
        steps: [
          { actor: 'John Smith', description: 'Do the first thing', status: 'COMPLETED' },
          { actor: 'John Smith', description: 'Do the second thing', status: 'NOT_STARTED' },
        ],
      } as EvaluatedBlock<GoalSummaryCardAgreed>,
      nunjucksEnv,
    )

    expect(html).toContain('1 out of 2 steps completed.')
  })

  it('uses "steps completed" wording when there is one step on agreed cards', async () => {
    const html = await goalSummaryCardAgreed.render(
      {
        ...baseBlock,
        variant: 'goalSummaryCardAgreed',
        steps: [{ actor: 'John Smith', description: 'Do the thing', status: 'COMPLETED' }],
      } as EvaluatedBlock<GoalSummaryCardAgreed>,
      nunjucksEnv,
    )

    expect(html).toContain('1 out of 1 steps completed.')
  })

  it('uses "steps completed" wording when there is one step on history cards', async () => {
    const html = await goalSummaryCardHistory.render(
      {
        ...baseBlock,
        variant: 'goalSummaryCardHistory',
        steps: [{ actor: 'John Smith', description: 'Do the thing', status: 'COMPLETED' }],
      } as EvaluatedBlock<GoalSummaryCardHistory>,
      nunjucksEnv,
    )

    expect(html).toContain('1 out of 1 steps completed.')
  })
})
