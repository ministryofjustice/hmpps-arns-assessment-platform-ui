import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Collection } from '../../constants/collection'

export const emptyCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, collection: Collection) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections

    collections
      .find(it => it.name === collection.name)
      .items.forEach(async item => {
        if (item) {
          await deps.api.executeCommand({
            type: 'RemoveCollectionItemCommand',
            collectionItemUuid: item.uuid,
            assessmentUuid,
            user,
          })
        }
      })
  }
