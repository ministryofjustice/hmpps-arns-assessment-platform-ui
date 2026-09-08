import { hasNoOtherOpenGoals } from './openGoals'
import { DerivedGoal } from '../types'

const makeGoal = (overrides: Partial<DerivedGoal> = {}): DerivedGoal => ({
  uuid: 'g-1',
  title: 'Test goal',
  status: 'ACTIVE',
  targetDate: '2025-01-01T00:00:00.000Z',
  statusDate: '2024-06-01T00:00:00.000Z',
  areaOfNeed: 'accommodation',
  areaOfNeedLabel: 'Accommodation',
  relatedAreasOfNeed: [],
  relatedAreasOfNeedLabels: [],
  steps: [],
  notes: [],
  collectionIndex: 0,
  isFirstInStatus: true,
  isLastInStatus: true,
  ...overrides,
})

describe('hasNoOtherOpenGoals', () => {
  it('should return true when every other goal is closed', () => {

    const goals = [
      makeGoal({ uuid: 'changed', status: 'ACHIEVED' }),
      makeGoal({ uuid: 'other-1', status: 'ACHIEVED' }),
      makeGoal({ uuid: 'other-2', status: 'REMOVED' }),
    ]

    const result = hasNoOtherOpenGoals(goals, 'changed')

    expect(result).toBe(true)
  })

  it('should return false when another goal is still ACTIVE', () => {

    const goals = [
      makeGoal({ uuid: 'changed', status: 'ACHIEVED' }),
      makeGoal({ uuid: 'other-1', status: 'ACTIVE' }),
      makeGoal({ uuid: 'other-2', status: 'REMOVED' }),
    ]

    const result = hasNoOtherOpenGoals(goals, 'changed')

    expect(result).toBe(false)
  })

  it('should return false when another goal is FUTURE', () => {

    const goals = [
      makeGoal({ uuid: 'changed', status: 'ACHIEVED' }),
      makeGoal({ uuid: 'other-1', status: 'FUTURE' }),
      makeGoal({ uuid: 'other-2', status: 'REMOVED' }),
    ]

    const result = hasNoOtherOpenGoals(goals, 'changed')

    expect(result).toBe(false)
  })

  it('should return true when the changed goal is the only open one', () => {

    const goals = [
      makeGoal({ uuid: 'changed', status: 'ACTIVE' }),
      makeGoal({ uuid: 'other-1', status: 'ACHIEVED' }),
      makeGoal({ uuid: 'other-2', status: 'REMOVED' }),
    ]

    const result = hasNoOtherOpenGoals(goals, 'changed')

    expect(result).toBe(true)
  })

  it('should return true when the goals list is empty', () => {

    const goals: DerivedGoal[] = []

    const result = hasNoOtherOpenGoals(goals, 'changed')

    expect(result).toBe(true)
  })

  it('should return false when changedGoalUuid is omitted and an open goal is present', () => {

    const goals = [makeGoal({ uuid: 'other-1', status: 'ACTIVE' }), makeGoal({ uuid: 'other-2', status: 'ACHIEVED' })]

    const result = hasNoOtherOpenGoals(goals)

    expect(result).toBe(false)
  })
})
