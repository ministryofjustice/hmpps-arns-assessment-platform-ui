import { snapshotFromGoal } from './goalSnapshot'
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

describe('snapshotFromGoal', () => {
  it('should return undefined for targetDate when goal has no target date', () => {
    // Arrange
    const goal = makeGoal({ targetDate: undefined })

    // Act
    const snapshot = snapshotFromGoal(goal)

    // Assert
    expect(snapshot.targetDate).toBeUndefined()
  })

  it('should pass date strings through unchanged', () => {
    // Arrange
    const goal = makeGoal({
      targetDate: '2025-07-26T00:00:00.000Z',
      statusDate: '2024-08-01T00:00:00.000Z',
    })

    // Act
    const snapshot = snapshotFromGoal(goal)

    // Assert
    expect(snapshot.targetDate).toBe('2025-07-26T00:00:00.000Z')
    expect(snapshot.statusDate).toBe('2024-08-01T00:00:00.000Z')
  })

  it('should let overrides win over the snapshotted values', () => {
    // Arrange
    const goal = makeGoal({ status: 'ACTIVE', targetDate: '2025-01-01T00:00:00.000Z' })

    // Act
    const snapshot = snapshotFromGoal(goal, { status: 'REMOVED', targetDate: undefined })

    // Assert
    expect(snapshot.status).toBe('REMOVED')
    expect(snapshot.targetDate).toBeUndefined()
  })

  it('should map steps to actor slug, description and status', () => {
    // Arrange
    const goal = makeGoal({
      steps: [
        {
          uuid: 's-1',
          actor: 'person_on_probation',
          actorLabel: 'Joan',
          description: 'Find a flat',
          status: 'NOT_STARTED',
          statusDate: '2024-08-01',
        },
      ],
    })

    // Act
    const snapshot = snapshotFromGoal(goal)

    // Assert
    expect(snapshot.steps).toEqual([
      { actor: 'person_on_probation', description: 'Find a flat', status: 'NOT_STARTED' },
    ])
  })
})
