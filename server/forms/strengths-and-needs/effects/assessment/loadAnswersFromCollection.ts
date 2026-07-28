import {StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps} from '../types'
import {wrapAll} from "../../../../data/aap-api/wrappers";
import {Answers} from "../../../../interfaces/aap-api/dataModel";

export const loadAnswersFromCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, collectionCode: string, collectionName: string) => {
    let assessment = context.getData('assessment')
    const collections = assessment.collections
    context.setData(collectionCode, collections
      .find(collection => collection.name === collectionName)?.items ?? [])
    context.setData('victimCollectionUuid', collections
      .find(collection => collection.name === collectionName)?.uuid ?? '')
}
