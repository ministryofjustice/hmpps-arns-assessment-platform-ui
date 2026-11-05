import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { emptyCollection } from './emptyCollection'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Collection } from '../../../../interfaces/aap-api/dataModel'
import { victimsCollection } from '../../versions/v1.0/journeys/offence-analysis/constants/collections'
import { Question } from '../../versions/v1.0/journeys/offence-analysis/constants/question'
import { Option } from '../../versions/v1.0/journeys/offence-analysis/constants/option'
import { CommonOption } from '../../versions/v1.0/constants/commonOption'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH', token: 'test-token' }

const collection = (name: string, itemUuids: string[] = []): Collection => ({
  name,
  uuid: 'e8f1a0a4-0000-4000-8000-000000000002',
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-10-01T10:00:00Z',
  items: itemUuids.map(uuid => ({ uuid })),
})

const contextFor = (
  collections: Collection[],
  answers: Record<string, unknown> = { [Question.offence_analysis_who_was_the_victim]: [CommonOption.other] },
) =>
  createTestEffectContext({
    answers,
    data: { assessmentUuid, assessment: { collections } },
    state: { user },
  }) as unknown as StrengthsAndNeedsContext

describe('emptyCollection', () => {
  const executeCommands = jest.fn()
  const deps = { api: { executeCommands } } as unknown as StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    executeCommands.mockReset().mockResolvedValue([])
  })

  it.each([
    { description: 'there are no collections', collections: [] },
    { description: 'only other collections exist', collections: [collection('OTHER', ['other-item'])] },
  ])('resolves without API commands when $description', async ({ collections }) => {
    await expect(emptyCollection(deps)(contextFor(collections), victimsCollection)).resolves.toBeUndefined()

    expect(executeCommands).not.toHaveBeenCalled()
  })

  it.each([
    { description: 'the victim question is unanswered', answers: {} },
    {
      description: 'the victim was one or more people',
      answers: { [Question.offence_analysis_who_was_the_victim]: [Option.one_or_more_person] },
    },
    {
      description: 'the victim was one or more people and other',
      answers: { [Question.offence_analysis_who_was_the_victim]: [Option.one_or_more_person, CommonOption.other] },
    },
  ])('keeps the collection when $description', async ({ answers }) => {
    const collections = [collection(victimsCollection.name, ['victim-1'])]

    await emptyCollection(deps)(contextFor(collections, answers), victimsCollection)

    expect(executeCommands).not.toHaveBeenCalled()
  })

  it('removes every item in the named collection in one batch with the assessment UUID and user', async () => {
    const collections = [
      collection('OTHER', ['other-item']),
      collection(victimsCollection.name, ['victim-1', 'victim-2']),
    ]

    await emptyCollection(deps)(contextFor(collections), victimsCollection)

    expect(executeCommands).toHaveBeenCalledTimes(1)
    expect(executeCommands).toHaveBeenCalledWith(
      ...['victim-1', 'victim-2'].map(collectionItemUuid => ({
        type: 'RemoveCollectionItemCommand',
        collectionItemUuid,
        assessmentUuid,
        user,
      })),
    )
  })

  it('propagates removal-command failures', async () => {
    const error = new Error('Removal failed')
    executeCommands.mockRejectedValueOnce(error)

    await expect(
      emptyCollection(deps)(contextFor([collection(victimsCollection.name, ['victim-1'])]), victimsCollection),
    ).rejects.toBe(error)
  })
})
