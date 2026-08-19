import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'

export const updateItemFromCollection =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (
    context: StrengthsAndNeedsContext,
    collectionCode: string,
    collectionName: string,
    fieldCodes: string[],
    itemIndex: string | any,
  ) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections

    const item = collections.find(collection => collection.name === collectionName).items.at(itemIndex)

    const items: Record<string, unknown> = {}

    // Get form answers
    for (const code of fieldCodes) {
      const value = context.getAnswer(code)

      if (value !== undefined) {
        items[code] = value
      }
    }

    const collection = (context.getAnswer(collectionCode) ?? []) as unknown[]
    context.setAnswer(collectionCode, [...collection, items])

    for (const code of fieldCodes) {
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
