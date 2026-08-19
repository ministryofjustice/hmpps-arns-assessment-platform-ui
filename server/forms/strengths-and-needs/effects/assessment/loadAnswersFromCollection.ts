import { StrengthsAndNeedsContext } from '../types'

export const loadAnswersFromCollection =
  () => async (context: StrengthsAndNeedsContext, collectionCode: string, collectionName: string) => {
    const assessment = context.getData('assessment')
    const collections = assessment.collections
    context.setData(
      collectionCode,
      collections
        .find(collection => collection.name === collectionName)?.items ?? [],
    )
    context.setData(
      'victimCollectionUuid',
      collections
        .find(collection => collection.name === collectionName)?.uuid ?? '',
    )
  }
