import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Collection } from '../../constants/collection'

export const updateItemFromCollection =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, collection: Collection, itemIndex: string | any) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections

    const item = collections.find(it => it.name === collection.name).items.at(itemIndex)

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
      type: 'UpdateCollectionItemAnswersCommand',
      collectionItemUuid: item.uuid,
      added: wrapAll(items),
      removed: [],
      assessmentUuid,
      user,
    })

  }
