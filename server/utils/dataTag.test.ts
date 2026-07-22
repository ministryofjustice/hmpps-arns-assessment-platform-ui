import { buildSelectionEventName, toKebabCase } from './dataTag'

describe('data tags', () => {
  it('converts stable values to lowercase kebab-case', () => {
    expect(toKebabCase(' CANNOT_BE_DONE_YET ')).toBe('cannot-be-done-yet')
  })

  it('builds a selection event from the control and both option values', () => {
    expect(buildSelectionEventName('add-steps-step-status-select', 'NOT_STARTED', 'IN_PROGRESS')).toBe(
      'add-steps-step-status-select-changed-from-not-started-to-in-progress',
    )
  })

  it('records a change back to the blank option', () => {
    expect(buildSelectionEventName('add-steps-step-status-select', 'IN_PROGRESS', '')).toBe(
      'add-steps-step-status-select-changed-from-in-progress-to-not-selected',
    )
  })
})
