import {StrengthsAndNeedsContext} from '../types'

export const removeItemToCollection =
  () => (context: StrengthsAndNeedsContext, collectionCode: string) => {
    const indexStr = context.getQueryParam('remove')

    if (indexStr === undefined) {
      return
    }

    const index = parseInt(String(indexStr), 10)
    const collection = (context.getAnswer(collectionCode) ?? []) as unknown[]

    if (index >= 0 && index < collection.length) {
      const updated = [...collection]
      updated.splice(index, 1)
      context.setAnswer(collectionCode, updated)
    }
  }

