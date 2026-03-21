import { AnswerHistory } from '@form-engine/core/compilation/thunks/types'

const USER_MUTATION_SOURCES = ['post', 'processed', 'dependent', 'action'] as const

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
