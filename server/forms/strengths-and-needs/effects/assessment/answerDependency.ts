/**
 * Clearing answers that belong to a different step.
 *
 * Example: the practitioner picks "Temporary" accommodation, then answers
 * "where do they live?" on the next page. Later they go back and switch to
 * "No accommodation". The housing answer no longer applies, but nothing in
 * forge removes it:
 *
 *  - `dependentWhen` only looks at fields on the page being submitted, and the
 *    housing answer is on a different page.
 *  - Cleardown only removes answers from pages that have dropped out of the
 *    journey, and that page is still in it.
 *
 * So those answers have to be declared here instead.
 *
 * They are written as plain objects rather than functions because they get
 * passed to an effect, and effect arguments are serialised by the authoring
 * pipeline.
 */

export type AnswerCondition =
  | {
      /** The answer that decides whether the dependants apply. */
      readonly answer: string
      /** Dependants apply while the governing answer is one of these. */
      readonly isOneOf: readonly string[]
    }
  | {
      readonly answer: string
      /** Dependants apply unless the governing answer is one of these. */
      readonly isNoneOf: readonly string[]
    }

export interface AnswerDependency {
  /** Dependants apply while any one of these holds. */
  readonly appliesWhen: readonly AnswerCondition[]
  /** The answers that stop applying when none of them hold. */
  readonly codes: readonly string[]
}

export type ReadAnswer = (code: string) => unknown

/** Each journey's declarations, keyed by journey name. */
export type AnswerDependencyRegistry = Readonly<Record<string, readonly AnswerDependency[]>>

/** Every answer a declaration mentions, governing and dependant alike. */
const codesOf = (dependency: AnswerDependency): string[] => [
  ...dependency.appliesWhen.map(condition => condition.answer),
  ...dependency.codes,
]

/**
 * Narrows the registry down to the journey being saved.
 *
 * A save only ever submits one page, so whichever journey mentions those fields
 * is the one the practitioner is in. Every other journey is left alone.
 */
export const dependenciesForTouchedAnswers = (
  registry: AnswerDependencyRegistry,
  touched: readonly string[],
): AnswerDependency[] => {
  const changed = new Set(touched)

  return Object.values(registry)
    .filter(dependencies => dependencies.some(dependency => codesOf(dependency).some(code => changed.has(code))))
    .flat()
}

/** Checkboxes give us an array, every other question a single value. */
const valuesOf = (value: unknown): string[] => {
  if (value === undefined || value === null) {
    return []
  }

  return Array.isArray(value) ? value.map(String) : [String(value)]
}

const holds = (condition: AnswerCondition, readAnswer: ReadAnswer): boolean => {
  const values = valuesOf(readAnswer(condition.answer))

  if ('isOneOf' in condition) {
    return values.some(value => condition.isOneOf.includes(value))
  }

  return values.every(value => !condition.isNoneOf.includes(value))
}

/**
 * True once the practitioner has answered at least one of the governing
 * questions. Until then we know nothing, and deleting would be a guess.
 */
const isGoverned = (dependency: AnswerDependency, readAnswer: ReadAnswer): boolean =>
  dependency.appliesWhen.some(condition => valuesOf(readAnswer(condition.answer)).length > 0)

/** The answers that no longer apply and should be deleted. */
export const inapplicableAnswerCodes = (
  dependencies: readonly AnswerDependency[],
  readAnswer: ReadAnswer,
): string[] => {
  const stale = dependencies
    .filter(dependency => isGoverned(dependency, readAnswer))
    .filter(dependency => !dependency.appliesWhen.some(condition => holds(condition, readAnswer)))
    .flatMap(dependency => dependency.codes)
    /* Nothing to delete for a question they never answered. */
    .filter(code => valuesOf(readAnswer(code)).length > 0)

  return [...new Set(stale)]
}
