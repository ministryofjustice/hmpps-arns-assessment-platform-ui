import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

export const emptyCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, collectionName: string) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections

    collections
      .find(collection => collection.name === collectionName)
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
