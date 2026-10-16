import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { emptyCollection } from './emptyCollection'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Collection } from '../../../../interfaces/aap-api/dataModel'
import { victimsCollection } from '../../versions/v1.0/journeys/offence-analysis/constants/collections'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH', token: 'test-token' }

const collection = (name: string, itemUuids: string[] = []): Collection => ({
  name,
  uuid: 'e8f1a0a4-0000-4000-8000-000000000002',
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-10-01T10:00:00Z',
  items: itemUuids.map(uuid => ({ uuid })),
})

const contextFor = (collections: Collection[]) =>
  createTestEffectContext({
    data: { assessmentUuid, assessment: { collections } },
    state: { user },
  }) as unknown as StrengthsAndNeedsContext

describe('emptyCollection', () => {
  const executeCommand = jest.fn()
  const deps = { api: { executeCommand } } as unknown as StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    executeCommand.mockReset().mockResolvedValue(undefined)
  })

  it.each([
    { description: 'there are no collections', collections: [] },
    { description: 'only other collections exist', collections: [collection('OTHER', ['other-item'])] },
    { description: 'the named collection has no items', collections: [collection(victimsCollection.name)] },
  ])('resolves without API commands when $description', async ({ collections }) => {
    await expect(emptyCollection(deps)(contextFor(collections), victimsCollection)).resolves.toBeUndefined()

    expect(executeCommand).not.toHaveBeenCalled()
  })

  it('removes every item in the named collection with the assessment UUID and user', async () => {
    const collections = [
      collection('OTHER', ['other-item']),
      collection(victimsCollection.name, ['victim-1', 'victim-2']),
    ]

    await emptyCollection(deps)(contextFor(collections), victimsCollection)

    expect(executeCommand).toHaveBeenCalledTimes(2)
    for (const [index, collectionItemUuid] of ['victim-1', 'victim-2'].entries()) {
      expect(executeCommand).toHaveBeenNthCalledWith(index + 1, {
        type: 'RemoveCollectionItemCommand',
        collectionItemUuid,
        assessmentUuid,
        user,
      })
    }
  })

  it.each([0, 1])('waits for all removal commands when command %i finishes first', async firstToFinish => {
    const removals = [Promise.withResolvers<void>(), Promise.withResolvers<void>()]
    executeCommand.mockReturnValueOnce(removals[0].promise).mockReturnValueOnce(removals[1].promise)
    const resolved = jest.fn()

    const pending = emptyCollection(deps)(
      contextFor([collection(victimsCollection.name, ['victim-1', 'victim-2'])]),
      victimsCollection,
    ).then(resolved)

    expect(executeCommand).toHaveBeenCalledTimes(2)
    expect(resolved).not.toHaveBeenCalled()

    removals[firstToFinish].resolve()
    await new Promise(setImmediate)
    expect(resolved).not.toHaveBeenCalled()

    removals[1 - firstToFinish].resolve()
    await pending
    expect(resolved).toHaveBeenCalledTimes(1)
  })

  it('propagates removal-command failures', async () => {
    const error = new Error('Removal failed')
    executeCommand.mockRejectedValueOnce(error)

    await expect(
      emptyCollection(deps)(contextFor([collection(victimsCollection.name, ['victim-1'])]), victimsCollection),
    ).rejects.toBe(error)
  })
})
