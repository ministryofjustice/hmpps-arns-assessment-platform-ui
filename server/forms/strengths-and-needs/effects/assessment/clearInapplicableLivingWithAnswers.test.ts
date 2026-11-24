import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { clearInapplicableLivingWithAnswers } from './clearInapplicableLivingWithAnswers'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { PendingCommand } from './pendingCommands'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH' as const, token: 'test-token' }

const livingWithAnswers = {
  living_with: ['PARTNER', 'OTHER'],
  living_with_partner_details: 'partner',
  living_with_other_details: 'other',
}

describe('clearInapplicableLivingWithAnswers', () => {
  const run = async (answers: Record<string, unknown>) => {
    const context = createTestEffectContext({
      answers,
      data: { assessmentUuid },
      state: { user },
    }) as unknown as StrengthsAndNeedsContext

    await clearInapplicableLivingWithAnswers({} as StrengthsAndNeedsEffectsDeps)(context)

    const pending = (context.getData('pendingCommands') ?? []) as PendingCommand[]

    return { context, pending }
  }

  it.each([
    ['approved premises', { current_accommodation: 'TEMPORARY', type_of_temporary_accommodation: 'APPROVED_PREMISES' }],
    ['no accommodation', { current_accommodation: 'NO_ACCOMMODATION', type_of_no_accommodation: 'CAMPSITE' }],
  ])('removes who they live with for %s', async (_name, status) => {
    const { context, pending } = await run({ ...status, ...livingWithAnswers })

    expect(pending).toHaveLength(1)
    expect(pending[0].command.removed.sort()).toEqual([
      'living_with',
      'living_with_other_details',
      'living_with_partner_details',
    ])
    expect(pending[0].command.added).toEqual({})
    expect(context.getAnswer('living_with')).toBeUndefined()
  })

  it.each([
    ['settled', { current_accommodation: 'SETTLED', type_of_settled_accommodation: 'HOMEOWNER' }],
    ['short term', { current_accommodation: 'TEMPORARY', type_of_temporary_accommodation: 'SHORT_TERM' }],
    ['immigration', { current_accommodation: 'TEMPORARY', type_of_temporary_accommodation: 'IMMIGRATION' }],
  ])('keeps who they live with for %s', async (_name, status) => {
    const { context, pending } = await run({ ...status, ...livingWithAnswers })

    expect(pending).toEqual([])
    expect(context.getAnswer('living_with')).toEqual(['PARTNER', 'OTHER'])
  })

  it('saves nothing when who they live with was never answered', async () => {
    const { pending } = await run({ current_accommodation: 'NO_ACCOMMODATION' })

    expect(pending).toEqual([])
  })
})
