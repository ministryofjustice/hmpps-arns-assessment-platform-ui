import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { clearUnselectedDrugAnswers } from './clearUnselectedDrugAnswers'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { PendingCommand } from './pendingCommands'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH' as const, token: 'test-token' }

describe('clearUnselectedDrugAnswers', () => {
  const run = async (answers: Record<string, unknown>) => {
    const context = createTestEffectContext({
      answers,
      data: { assessmentUuid },
      state: { user },
    }) as unknown as StrengthsAndNeedsContext

    await clearUnselectedDrugAnswers({} as StrengthsAndNeedsEffectsDeps)(context)

    const pending = (context.getData('pendingCommands') ?? []) as PendingCommand[]

    return { context, pending }
  }

  it('removes the answers about a drug that is no longer selected, and keeps the rest', async () => {
    const { context, pending } = await run({
      select_misused_drugs: ['BENZODIAZEPINES'],
      drug_last_used_benzodiazepines: 'LAST_SIX',
      how_often_used_last_six_months_amphetamines: 'DAILY',
      how_often_used_last_six_months_amphetamines_details: 'daily',
      drugs_injected_amphetamines: ['LAST_SIX'],
      drugs_injected: ['AMPHETAMINES', 'BENZODIAZEPINES'],
    })

    expect(pending).toHaveLength(1)
    expect(pending[0].command.removed.sort()).toEqual([
      'drugs_injected_amphetamines',
      'how_often_used_last_six_months_amphetamines',
      'how_often_used_last_six_months_amphetamines_details',
    ])
    expect(pending[0].command.added).toEqual({ drugs_injected: { type: 'Multi', values: ['BENZODIAZEPINES'] } })
    expect(context.getAnswer('how_often_used_last_six_months_amphetamines')).toBeUndefined()
    expect(context.getAnswer('drug_last_used_benzodiazepines')).toBe('LAST_SIX')
  })

  it('removes the injected answer once none of its drugs are selected', async () => {
    const { pending } = await run({
      select_misused_drugs: ['BENZODIAZEPINES'],
      drugs_injected: ['AMPHETAMINES'],
    })

    expect(pending[0].command.removed).toEqual(['drugs_injected'])
    expect(pending[0].command.added).toEqual({})
  })

  it('keeps answ ers in the injected list that are not drugs', async () => {
    const { pending } = await run({
      select_misused_drugs: ['BENZODIAZEPINES'],
      drugs_injected: ['AMPHETAMINES', 'NONE'],
    })

    expect(pending[0].command.added).toEqual({ drugs_injected: { type: 'Multi', values: ['NONE'] } })
  })

  it('saves nothing when every answer is about a selected drug', async () => {
    const { pending } = await run({
      select_misused_drugs: ['AMPHETAMINES'],
      how_often_used_last_six_months_amphetamines: 'DAILY',
      drugs_injected: ['AMPHETAMINES'],
    })

    expect(pending).toEqual([])
  })
})
