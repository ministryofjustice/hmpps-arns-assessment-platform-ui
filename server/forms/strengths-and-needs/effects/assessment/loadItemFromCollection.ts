import { StrengthsAndNeedsContext } from '../types'
import { unwrapAll } from '../../../../data/aap-api/wrappers'
import { Collection } from '../../constants/collection'

export const loadItemFromCollection =
  () => (context: StrengthsAndNeedsContext, collection: Collection, itemIndex: string | any) => {
    const assessment = context.getData('assessment')
    const collections = assessment.collections

    const items = collections.find(it => it.name === collection.name).items.at(itemIndex)
    const answers = unwrapAll<Record<string, unknown>>(items.answers)

    for (const code of collection.fields) {
      context.setAnswer(code, answers[code])
    }
  }
