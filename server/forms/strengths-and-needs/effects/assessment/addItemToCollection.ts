import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Collection } from '../../constants/collection'

export const addItemToCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, collection: Collection) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    // Get or create the collection
    let collectionUuid = (context.getData('collectionUuids') ?? {})[collection.name]

    if (!collectionUuid) {
      const createResult = await deps.api.executeCommand({
        type: 'CreateCollectionCommand',
        name: collection.name,
        assessmentUuid,
        user,
      })

      collectionUuid = createResult.collectionUuid
      collection.storeUuid(collectionUuid, context)
    }

    const items: Record<string, unknown> = {}

    // Get form answers
    for (const code of collection.fields) {
      const value = context.getAnswer(code)

      if (value !== undefined) {
        items[code] = value
      }
    }

    const collectionAnswer = (context.getAnswer(collection.name) ?? []) as unknown[]
    context.setAnswer(collection.name, [...collectionAnswer, items])

    for (const code of collection.fields) {
      context.setAnswer(code, undefined)
    }

    await deps.api.executeCommand({
      type: 'AddCollectionItemCommand',
      collectionUuid,
      properties: {},
      answers: wrapAll(items),
      assessmentUuid,
      user,
    })
  }
