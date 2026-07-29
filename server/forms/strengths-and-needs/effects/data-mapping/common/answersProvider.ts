/** Port of oasys/datamapping/common/AnswersProvider.kt. */

import { FieldType, type FormConfig } from '../formConfig'
import { Field, fieldLower, type Value } from '../codes'
import { InvalidMappingException } from '../exceptions'
import type { Answers, PersistedAnswer } from '../answers'

export abstract class AnswerBase {
  get value(): string | null | undefined {
    throw new InvalidMappingException(`Invalid use of '.value' on a ${this.constructor.name}`)
  }

  get values(): string[] | null | undefined {
    throw new InvalidMappingException(`Invalid use of '.values' on a ${this.constructor.name}`)
  }

  get collection(): Answers[] {
    throw new InvalidMappingException(`Invalid use of '.collection' on a ${this.constructor.name}`)
  }
}

export class SingleValueAnswer extends AnswerBase {
  constructor(private readonly _value: string | null | undefined) {
    super()
  }

  override get value(): string | null | undefined {
    return this._value
  }
}

export class MultipleValuesAnswer extends AnswerBase {
  constructor(private readonly _values: string[] | null | undefined) {
    super()
  }

  override get values(): string[] | null | undefined {
    return this._values
  }
}

export class CollectionAnswer extends AnswerBase {
  constructor(private readonly _collection: Answers[]) {
    super()
  }

  override get collection(): Answers[] {
    return this._collection
  }
}

export class AnswersProvider {
  private context: string | null = null

  constructor(
    private readonly answers: Answers,
    private readonly config: FormConfig,
  ) {}

  setContext(field: Field): void {
    const lower = fieldLower(field)
    if (this.config.fields[lower]) {
      this.context = lower
      return
    }
    const match = Object.entries(this.config.fields).find(([, fieldConfig]) => fieldConfig.code === lower)
    this.context = match ? match[0] : null
  }

  answer(field: Field): AnswerBase {
    this.setContext(field)

    const fieldConfig = this.context !== null ? this.config.fields[this.context] : undefined
    if (!fieldConfig) {
      throw new InvalidMappingException(
        `Field ${fieldLower(field)} does not exist in form config version ${this.config.version}`,
      )
    }

    const answer: PersistedAnswer | undefined = this.answers[fieldConfig.code]
    switch (fieldConfig.type) {
      case FieldType.CHECKBOX:
        return new MultipleValuesAnswer(
          answer?.values && answer.values.length === 1 && answer.values[0] === '' ? [] : (answer?.values ?? null),
        )
      case FieldType.COLLECTION:
        return new CollectionAnswer(answer?.collection ?? [])
      default:
        return new SingleValueAnswer(answer?.value ?? null)
    }
  }

  get(value: Value): string {
    if (this.context === null) {
      throw new InvalidMappingException('Cannot obtain values without a field context. Call answer() first')
    }

    const valueName: string = value
    const options = this.config.fields[this.context]?.options ?? []

    if (!options.some(option => option.value === valueName)) {
      throw new InvalidMappingException(
        `${valueName} is not a valid option for field ${this.context} in form config version ${this.config.version}`,
      )
    }

    return valueName
  }
}
