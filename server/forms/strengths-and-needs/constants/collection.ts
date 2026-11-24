import { StrengthsAndNeedsContext } from '../effects/types'

export interface Collection {
  name: string
  fields: string[]
}

export const storeCollectionUuid = (collectionName: string, uuid: string, context: StrengthsAndNeedsContext) => {
  context.setData('collectionUuids', {
    ...(context.getData('collectionUuids') ?? {}),
    [collectionName]: uuid,
  })
}
