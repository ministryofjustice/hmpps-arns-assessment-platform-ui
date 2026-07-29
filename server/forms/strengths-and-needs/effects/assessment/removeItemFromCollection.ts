import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

export const removeItemFromCollection =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, collectionName: string, itemIndex: string | any) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections

    const item = collections.find(collection => collection.name === collectionName).items.at(itemIndex - 1)

    if (item) {
      await deps.api.executeCommand({
        type: 'RemoveCollectionItemCommand',
        collectionItemUuid: item.uuid,
        assessmentUuid,
        user,
      })
    }
  }
