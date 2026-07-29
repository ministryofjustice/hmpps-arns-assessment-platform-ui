/** Port of oasys/datamapping/common/SectionMapping.kt. */

import type { OasysEquivalent } from '../answers'
import type { AnswersProvider } from './answersProvider'

export type MappingFn = () => unknown
export type FieldsToMap = Record<string, MappingFn>

export abstract class SectionMapping {
  protected ap!: AnswersProvider

  abstract getFieldsToMap(): FieldsToMap

  map(answersProvider: AnswersProvider): OasysEquivalent {
    this.ap = answersProvider
    const result: Record<string, unknown> = {}
    for (const [field, fn] of Object.entries(this.getFieldsToMap())) {
      result[field] = fn()
    }
    return result
  }
}
