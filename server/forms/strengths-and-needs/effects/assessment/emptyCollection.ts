import { BadRequest } from 'http-errors'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Collection } from '../../constants/collection'

export const emptyCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, collection: Collection) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const assessment = context.getData('assessment')
    const collections = assessment.collections
    const foundCollection = collections.find(it => it.name === collection.name) ?? null

    if (!foundCollection) {
      throw BadRequest(`Collection ${collection.name} not found`)
    }

    await Promise.all(
      foundCollection.items.map(async item =>
        deps.api.executeCommand({
          type: 'RemoveCollectionItemCommand',
          collectionItemUuid: item.uuid,
          assessmentUuid,
          user,
        }),
      ),
    )
  }
