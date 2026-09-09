import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Collection } from '../../constants/collection'

export const removeItemFromCollection =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, collection: Collection, itemIndex: string | any) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections

    const item = collections.find(it => it.name === collection.name).items.at(itemIndex - 1)

    if (item) {
      await deps.api.executeCommand({
        type: 'RemoveCollectionItemCommand',
        collectionItemUuid: item.uuid,
        assessmentUuid,
        user,
      })
    }
  }
