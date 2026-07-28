import {StrengthsAndNeedsContext} from '../types'
import {unwrapAll} from "../../../../data/aap-api/wrappers";

export const loadItemFromCollection =
    () => ( context: StrengthsAndNeedsContext, fieldCodes: string[], collectionName: string, itemIndex: string | any ) => {
      let assessment = context.getData('assessment')
      const collections = assessment.collections

      const items = collections.find(collection => collection.name === collectionName).items.at(itemIndex)
      const answers = unwrapAll<Record<string, unknown>>(items.answers)

      for (const code of fieldCodes) {
        context.setAnswer(code,answers[code])
      }
}

