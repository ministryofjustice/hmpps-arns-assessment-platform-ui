import { StrengthsAndNeedsContext } from '../types'
import { Collection } from '../../constants/collection'

export const loadAnswersFromCollection = () => async (context: StrengthsAndNeedsContext, collection: Collection) => {
  const assessment = context.getData('assessment')
  const collectionData = assessment.collections.find(it => it.name === collection.name)

  context.setData(collection.name, collectionData?.items ?? [])
  collection.storeUuid(collectionData?.uuid, context)
}
