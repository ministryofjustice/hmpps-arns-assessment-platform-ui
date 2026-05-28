import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Answers, Properties } from '../../../../interfaces/aap-api/dataModel'
import { AreaOfNeed, RawCollection, RawCollectionItem } from '../types'
import { deriveGoalsWithSteps } from './deriveGoalsWithStepsFromAssessment'

type DataToDeriveFrom = Parameters<typeof deriveGoalsWithSteps>[0]

function wrap(obj: Record<string, unknown>): Answers | Properties {
  return wrapAll(obj)
}

function goalItem(
  overrides: {
    uuid?: string
    answers?: Record<string, unknown>
    properties?: Record<string, unknown>
    collections?: RawCollection[]
  } = {},
): RawCollectionItem {
  return {
    uuid: overrides.uuid ?? 'goal-uuid-1',
    answers: wrap({
      title: 'Improve accommodation',
      area_of_need: 'accommodation',
      related_areas_of_need: [],
      target_date: '2025-06-01',
      ...overrides.answers,
    }),
    properties: wrap({
      status: 'ACTIVE',
      status_date: '2025-01-15',
      ...overrides.properties,
    }),
    collections: overrides.collections,
  }
}

function stepItem(
  overrides: {
    uuid?: string
    answers?: Record<string, unknown>
    properties?: Record<string, unknown>
  } = {},
): RawCollectionItem {
  return {
    uuid: overrides.uuid ?? 'step-uuid-1',
    answers: wrap({
      actor: 'probation_practitioner',
      status: 'NOT_STARTED',
      description: 'Refer to housing service',
      ...overrides.answers,
    }),
    properties: wrap({
      status_date: '2025-01-15',
      ...overrides.properties,
    }),
  }
}

function noteItem(
  overrides: {
    uuid?: string
    answers?: Record<string, unknown>
    properties?: Record<string, unknown>
  } = {},
): RawCollectionItem {
  return {
    uuid: overrides.uuid ?? 'note-uuid-1',
    answers: wrap({
      note: 'Initial note',
      created_by: 'John Doe',
      ...overrides.answers,
    }),
    properties: wrap({
      created_at: '2025-01-20T10:00:00Z',
      type: 'progress',
      ...overrides.properties,
    }),
  }
}

const defaultAreasOfNeed: AreaOfNeed[] = [
  {
    slug: 'accommodation',
    text: 'Accommodation',
    value: 'area_accommodation',
    crimNeedsKey: 'accommodation',
    assessmentKey: 'accommodation',
    handoverPrefix: 'acc',
    upperBound: 6,
    threshold: 1,
    goals: [],
  },
  {
    slug: 'finances',
    text: 'Finances',
    value: 'area_finances',
    crimNeedsKey: 'finance',
    assessmentKey: 'finance',
    handoverPrefix: 'finance',
    upperBound: null,
    threshold: null,
    goals: [],
  },
]

const defaultActorLabels: Record<string, string> = {
  probation_practitioner: 'Probation practitioner',
  someone_else: 'Someone else',
}

function goalsCollection(items: RawCollectionItem[], uuid = 'goals-uuid'): RawCollection {
  return { name: 'GOALS', uuid, items }
}

function buildData(overrides: Partial<DataToDeriveFrom> = {}): DataToDeriveFrom {
  return {
    assessment: undefined,
    caseData: undefined,
    actorLabels: undefined,
    areasOfNeed: undefined,
    ...overrides,
  }
}

describe('deriveGoalsWithSteps', () => {
  describe('deriveGoalsWithSteps()', () => {
    it('should return empty goals when assessment is undefined', () => {
      // Arrange
      const data = buildData()

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result).toEqual({ goals: [], goalsCollectionUuid: undefined })
    })

    it('should return empty goals when assessment has no collections', () => {
      // Arrange
      const data = buildData({ assessment: { collections: undefined } })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result).toEqual({ goals: [], goalsCollectionUuid: undefined })
    })

    it('should return empty goals when no GOALS collection exists', () => {
      // Arrange
      const data = buildData({
        assessment: { collections: [{ name: 'OTHER', uuid: 'other-uuid', items: [] }] },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result).toEqual({ goals: [], goalsCollectionUuid: undefined })
    })

    it('should return the goalsCollectionUuid from the GOALS collection', () => {
      // Arrange
      const data = buildData({
        assessment: { collections: [goalsCollection([], 'goals-collection-uuid')] },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goalsCollectionUuid).toBe('goals-collection-uuid')
    })

    it('should extract basic goal fields from wrapped answers and properties', () => {
      // Arrange
      const data = buildData({
        assessment: { collections: [goalsCollection([goalItem()])] },
        caseData: { name: { forename: 'Alex' } },
        actorLabels: defaultActorLabels,
        areasOfNeed: defaultAreasOfNeed,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals).toHaveLength(1)
      const goal = result.goals[0]
      expect(goal.uuid).toBe('goal-uuid-1')
      expect(goal.title).toBe('Improve accommodation')
      expect(goal.status).toBe('ACTIVE')
      expect(goal.areaOfNeed).toBe('accommodation')
      expect(goal.targetDate).toBe('2025-06-01')
      expect(goal.statusDate).toBe('2025-01-15')
      expect(goal.collectionIndex).toBe(0)
    })

    it('should resolve area of need slug to label', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [goalsCollection([goalItem({ answers: { area_of_need: 'finances' } })])],
        },
        areasOfNeed: defaultAreasOfNeed,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].areaOfNeedLabel).toBe('Finances')
    })

    it('should fall back to raw slug when area of need is not found', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [goalsCollection([goalItem({ answers: { area_of_need: 'unknown_area' } })])],
        },
        areasOfNeed: defaultAreasOfNeed,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].areaOfNeedLabel).toBe('unknown_area')
    })

    it('should return empty string for area of need label when slug is undefined', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [goalsCollection([goalItem({ answers: { area_of_need: undefined } })])],
        },
        areasOfNeed: defaultAreasOfNeed,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].areaOfNeedLabel).toBe('')
    })

    it('should resolve related areas of need slugs to labels', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([goalItem({ answers: { related_areas_of_need: ['accommodation', 'finances'] } })]),
          ],
        },
        areasOfNeed: defaultAreasOfNeed,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].relatedAreasOfNeed).toEqual(['accommodation', 'finances'])
      expect(result.goals[0].relatedAreasOfNeedLabels).toEqual(['Accommodation', 'Finances'])
    })

    it('should default related areas of need to empty array when not provided', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [goalsCollection([goalItem({ answers: { related_areas_of_need: undefined } })])],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].relatedAreasOfNeed).toEqual([])
      expect(result.goals[0].relatedAreasOfNeedLabels).toEqual([])
    })

    it('should include achievedBy from goal properties', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [goalsCollection([goalItem({ properties: { status: 'ACHIEVED', achieved_by: 'Jane Smith' } })])],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].achievedBy).toBe('Jane Smith')
    })
  })

  describe('actor label resolution', () => {
    it('should resolve person_on_probation to the forename', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [stepItem({ answers: { actor: 'person_on_probation' } })],
                  },
                ],
              }),
            ]),
          ],
        },
        caseData: { name: { forename: 'Alex' } },
        actorLabels: defaultActorLabels,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps[0].actorLabel).toBe('Alex')
    })

    it('should fall back to "Person on probation" when forename is missing', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [stepItem({ answers: { actor: 'person_on_probation' } })],
                  },
                ],
              }),
            ]),
          ],
        },
        actorLabels: defaultActorLabels,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps[0].actorLabel).toBe('Person on probation')
    })

    it('should resolve a known actor to its label', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [stepItem({ answers: { actor: 'probation_practitioner' } })],
                  },
                ],
              }),
            ]),
          ],
        },
        caseData: { name: { forename: 'Alex' } },
        actorLabels: defaultActorLabels,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps[0].actorLabel).toBe('Probation practitioner')
    })

    it('should fall back to raw actor value when label is not found', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [stepItem({ answers: { actor: 'unknown_actor' } })],
                  },
                ],
              }),
            ]),
          ],
        },
        caseData: { name: { forename: 'Alex' } },
        actorLabels: defaultActorLabels,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps[0].actorLabel).toBe('unknown_actor')
    })

    it('should return empty string when actor is undefined', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [stepItem({ answers: { actor: undefined } })],
                  },
                ],
              }),
            ]),
          ],
        },
        caseData: { name: { forename: 'Alex' } },
        actorLabels: defaultActorLabels,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps[0].actorLabel).toBe('')
    })
  })

  describe('step extraction', () => {
    it('should extract steps from nested STEPS collections', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [
                      stepItem({ uuid: 'step-1' }),
                      stepItem({ uuid: 'step-2', answers: { description: 'Second step' } }),
                    ],
                  },
                ],
              }),
            ]),
          ],
        },
        actorLabels: defaultActorLabels,
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps).toHaveLength(2)
      expect(result.goals[0].steps[0].uuid).toBe('step-1')
      expect(result.goals[0].steps[1].uuid).toBe('step-2')
      expect(result.goals[0].steps[1].description).toBe('Second step')
    })

    it('should return stepsCollectionUuid from the first STEPS collection', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [{ name: 'STEPS', uuid: 'steps-coll-uuid', items: [stepItem()] }],
              }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].stepsCollectionUuid).toBe('steps-coll-uuid')
    })

    it('should return empty steps array when goal has no collections', () => {
      // Arrange
      const data = buildData({
        assessment: { collections: [goalsCollection([goalItem()])] },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps).toEqual([])
      expect(result.goals[0].stepsCollectionUuid).toBeUndefined()
    })

    it('should flatten items from multiple STEPS collections', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  { name: 'STEPS', uuid: 'steps-1', items: [stepItem({ uuid: 'step-a' })] },
                  { name: 'STEPS', uuid: 'steps-2', items: [stepItem({ uuid: 'step-b' })] },
                ],
              }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps).toHaveLength(2)
      expect(result.goals[0].steps[0].uuid).toBe('step-a')
      expect(result.goals[0].steps[1].uuid).toBe('step-b')
      expect(result.goals[0].stepsCollectionUuid).toBe('steps-1')
    })

    it('should extract step status and statusDate', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'STEPS',
                    uuid: 'steps-uuid',
                    items: [
                      stepItem({
                        answers: { status: 'IN_PROGRESS' },
                        properties: { status_date: '2025-03-01' },
                      }),
                    ],
                  },
                ],
              }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].steps[0].status).toBe('IN_PROGRESS')
      expect(result.goals[0].steps[0].statusDate).toBe('2025-03-01')
    })
  })

  describe('note extraction', () => {
    it('should extract notes from nested NOTES collections', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [{ name: 'NOTES', uuid: 'notes-coll-uuid', items: [noteItem()] }],
              }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].notes).toHaveLength(1)
      expect(result.goals[0].notes[0].uuid).toBe('note-uuid-1')
      expect(result.goals[0].notes[0].note).toBe('Initial note')
      expect(result.goals[0].notes[0].createdBy).toBe('John Doe')
      expect(result.goals[0].notes[0].type).toBe('progress')
      expect(result.goals[0].notesCollectionUuid).toBe('notes-coll-uuid')
    })

    it('should sort notes newest first', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({
                collections: [
                  {
                    name: 'NOTES',
                    uuid: 'notes-uuid',
                    items: [
                      noteItem({
                        uuid: 'older-note',
                        properties: { created_at: '2025-01-01T10:00:00Z', type: 'progress' },
                      }),
                      noteItem({
                        uuid: 'newer-note',
                        properties: { created_at: '2025-03-15T10:00:00Z', type: 'progress' },
                      }),
                      noteItem({
                        uuid: 'middle-note',
                        properties: { created_at: '2025-02-10T10:00:00Z', type: 'progress' },
                      }),
                    ],
                  },
                ],
              }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].notes.map(n => n.uuid)).toEqual(['newer-note', 'middle-note', 'older-note'])
    })

    it('should return empty notes when goal has no NOTES collection', () => {
      // Arrange
      const data = buildData({
        assessment: { collections: [goalsCollection([goalItem()])] },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].notes).toEqual([])
      expect(result.goals[0].notesCollectionUuid).toBeUndefined()
    })
  })

  describe('isFirstInStatus / isLastInStatus', () => {
    it('should mark the only goal in a status as both first and last', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [goalsCollection([goalItem({ properties: { status: 'ACTIVE' } })])],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].isFirstInStatus).toBe(true)
      expect(result.goals[0].isLastInStatus).toBe(true)
    })

    it('should mark first and last goals within the same status group', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({ uuid: 'goal-1', properties: { status: 'ACTIVE' } }),
              goalItem({ uuid: 'goal-2', properties: { status: 'ACTIVE' } }),
              goalItem({ uuid: 'goal-3', properties: { status: 'ACTIVE' } }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].isFirstInStatus).toBe(true)
      expect(result.goals[0].isLastInStatus).toBe(false)
      expect(result.goals[1].isFirstInStatus).toBe(false)
      expect(result.goals[1].isLastInStatus).toBe(false)
      expect(result.goals[2].isFirstInStatus).toBe(false)
      expect(result.goals[2].isLastInStatus).toBe(true)
    })

    it('should calculate position flags independently per status group', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({ uuid: 'active-1', properties: { status: 'ACTIVE' } }),
              goalItem({ uuid: 'future-1', properties: { status: 'FUTURE' } }),
              goalItem({ uuid: 'active-2', properties: { status: 'ACTIVE' } }),
              goalItem({ uuid: 'future-2', properties: { status: 'FUTURE' } }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)
      const active1 = result.goals.find(g => g.uuid === 'active-1')!
      const active2 = result.goals.find(g => g.uuid === 'active-2')!
      const future1 = result.goals.find(g => g.uuid === 'future-1')!
      const future2 = result.goals.find(g => g.uuid === 'future-2')!

      // Assert
      expect(active1.isFirstInStatus).toBe(true)
      expect(active1.isLastInStatus).toBe(false)
      expect(active2.isFirstInStatus).toBe(false)
      expect(active2.isLastInStatus).toBe(true)
      expect(future1.isFirstInStatus).toBe(true)
      expect(future1.isLastInStatus).toBe(false)
      expect(future2.isFirstInStatus).toBe(false)
      expect(future2.isLastInStatus).toBe(true)
    })

    it('should preserve collectionIndex across mixed status groups', () => {
      // Arrange
      const data = buildData({
        assessment: {
          collections: [
            goalsCollection([
              goalItem({ uuid: 'goal-0', properties: { status: 'ACTIVE' } }),
              goalItem({ uuid: 'goal-1', properties: { status: 'FUTURE' } }),
              goalItem({ uuid: 'goal-2', properties: { status: 'ACTIVE' } }),
            ]),
          ],
        },
      })

      // Act
      const result = deriveGoalsWithSteps(data)

      // Assert
      expect(result.goals[0].collectionIndex).toBe(0)
      expect(result.goals[1].collectionIndex).toBe(1)
      expect(result.goals[2].collectionIndex).toBe(2)
    })
  })
})
