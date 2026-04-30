import { buildAnswerDelta } from './answerDelta'
import type { AnswerHistory } from './answerDelta'

describe('buildAnswerDelta', () => {
  it('should include answers changed by POST mutations', () => {
    // Arrange
    const histories: Record<string, AnswerHistory> = {
      current_accommodation: {
        current: 'SETTLED',
        mutations: [{ value: 'SETTLED', source: 'post' }],
      },
      existing_answer: {
        current: 'UNCHANGED',
        mutations: [{ value: 'UNCHANGED', source: 'access' }],
      },
    }

    // Act
    const delta = buildAnswerDelta(histories)

    // Assert
    expect(delta).toEqual({
      added: { current_accommodation: 'SETTLED' },
      removed: [],
    })
  })

  it('should mark dependent-cleared answers for removal', () => {
    // Arrange
    const histories: Record<string, AnswerHistory> = {
      type_of_temporary_accommodation: {
        current: undefined,
        mutations: [
          { value: 'SHORT_TERM', source: 'access' },
          { value: undefined, source: 'dependentWhen' },
        ],
      },
    }

    // Act
    const delta = buildAnswerDelta(histories)

    // Assert
    expect(delta).toEqual({
      added: {},
      removed: ['type_of_temporary_accommodation'],
    })
  })

  it('should not remove dependent-cleared answers that never existed in the assessment', () => {
    // Arrange
    const histories: Record<string, AnswerHistory> = {
      type_of_temporary_accommodation: {
        current: undefined,
        mutations: [
          { value: undefined, source: 'post' },
          { value: undefined, source: 'dependentWhen' },
        ],
      },
    }

    // Act
    const delta = buildAnswerDelta(histories)

    // Assert
    expect(delta).toEqual({
      added: {},
      removed: [],
    })
  })

  it('should include processed answers after formatters run', () => {
    // Arrange
    const histories: Record<string, AnswerHistory> = {
      strengths_or_protective_factors: {
        current: 'Trimmed value',
        mutations: [
          { value: '  Trimmed value  ', source: 'post' },
          { value: 'Trimmed value', source: 'processed' },
        ],
      },
    }

    // Act
    const delta = buildAnswerDelta(histories)

    // Assert
    expect(delta).toEqual({
      added: { strengths_or_protective_factors: 'Trimmed value' },
      removed: [],
    })
  })
})
