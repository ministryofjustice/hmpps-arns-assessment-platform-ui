const USER_MUTATION_SOURCES = ['post', 'processed', 'dependentWhen', 'action'] as const

interface AnswerMutation {
  source: string
  value: unknown
}

export interface AnswerHistory {
  current: unknown
  mutations: AnswerMutation[]
}

const isUserMutationSource = (source: string): boolean => {
  return USER_MUTATION_SOURCES.includes(source as (typeof USER_MUTATION_SOURCES)[number])
}

const hasExistingPersistedValue = (history: AnswerHistory): boolean => {
  return history.mutations.some(mutation => mutation.value !== undefined && !isUserMutationSource(mutation.source))
}

export interface AnswerDelta {
  added: Record<string, unknown>
  removed: string[]
}

export const buildAnswerDelta = (histories: Record<string, AnswerHistory>): AnswerDelta => {
  return Object.entries(histories).reduce<AnswerDelta>(
    (delta, [code, history]) => {
      const hasUserMutation = history.mutations.some(mutation => isUserMutationSource(mutation.source))

      if (!hasUserMutation) {
        return delta
      }

      if (history.current === undefined) {
        if (hasExistingPersistedValue(history)) {
          delta.removed.push(code)
        }

        return delta
      }

      delta.added[code] = history.current

      return delta
    },
    { added: {}, removed: [] },
  )
}

const persistedValue = (history: AnswerHistory): unknown => {
  const persistedMutations = history.mutations.filter(mutation => !isUserMutationSource(mutation.source))

  return persistedMutations[persistedMutations.length - 1]?.value
}

const isSameAnswer = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => item === b[index])
  }

  return a === b
}

/**
 * Codes the user actually changed on this submission.
 */
export const buildChangedAnswerCodes = (histories: Record<string, AnswerHistory>): string[] =>
  Object.entries(histories)
    .filter(([, history]) => history.mutations.some(mutation => isUserMutationSource(mutation.source)))
    .filter(([, history]) => !isSameAnswer(history.current, persistedValue(history)))
    .map(([code]) => code)
