import { StrengthsAndNeedsContext } from '../types'
import { Collection, storeCollectionUuid } from '../../constants/collection'

export const loadAnswersFromCollection = () => async (context: StrengthsAndNeedsContext, collection: Collection) => {
  const assessment = context.getData('assessment')
  const collectionData = assessment.collections.find(it => it.name === collection.name)

  context.setData(collection.name, collectionData?.items ?? [])
  storeCollectionUuid(collection.name, collectionData?.uuid, context)
}
