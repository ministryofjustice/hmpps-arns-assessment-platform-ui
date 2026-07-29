import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'

export const addItemToCollection =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, collectionName: string, collectionCode: string, fieldCodes: string[]) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    // Get or create OFFENCE_ANALYSIS_VICTIM collection
    let victimCollectionUuid = context.getData('victimCollectionUuid')

    if (!victimCollectionUuid) {
      const createResult = await deps.api.executeCommand({
        type: 'CreateCollectionCommand',
        name: collectionCode,
        assessmentUuid,
        user,
      })

      victimCollectionUuid = createResult.collectionUuid
    }

    const items: Record<string, unknown> = {}

    // Get form answers
    for (const code of fieldCodes) {
      const value = context.getAnswer(code)

      if (value !== undefined) {
        items[code] = value
      }
    }

    const collection = (context.getAnswer(collectionName) ?? []) as unknown[]
    context.setAnswer(collectionName, [...collection, items])

    for (const code of fieldCodes) {
      context.setAnswer(code, undefined)
    }

    await deps.api.executeCommand({
      type: 'AddCollectionItemCommand',
      collectionUuid: victimCollectionUuid,
      properties: {},
      answers: wrapAll(items),
      assessmentUuid,
      user,
    })

  }
