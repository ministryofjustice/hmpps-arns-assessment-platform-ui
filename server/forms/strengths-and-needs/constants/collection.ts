import { StrengthsAndNeedsContext } from '../effects/types'

export class Collection {
  name: string

  fields: string[]

  constructor(name: string, fields: string[]) {
    this.name = name
    this.fields = fields
  }

  storeUuid(uuid: string, context: StrengthsAndNeedsContext) {
    context.setData('collectionUuids', {
      ...(context.getData('collectionUuids') ?? {}),
      [this.name]: uuid,
    })
  }
}
