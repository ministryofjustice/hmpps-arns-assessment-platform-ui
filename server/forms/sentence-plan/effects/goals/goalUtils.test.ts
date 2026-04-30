import { InternalServerError } from 'http-errors'
import { AuthSource } from '../../../../interfaces/hmppsUser'
import { AreaOfNeed, DerivedGoal, SentencePlanContext } from '../types'
import {
  MONTHS_BY_OPTION,
  getMatchingTargetDateOption,
  calculateTargetDate,
  determineGoalStatus,
  buildGoalProperties,
  buildGoalAnswers,
  getRequiredEffectContext,
  getPractitionerName,
  resolveActiveGoalFromRequest,
  setActiveGoalData,
  deriveAreasOfNeedData,
} from './goalUtils'

const createMockContext = (
  overrides: {
    data?: Record<string, unknown>
    state?: Record<string, unknown>
    session?: Record<string, unknown>
    params?: Record<string, string>
  } = {},
): SentencePlanContext =>
  ({
    getData: jest.fn((key: string) => overrides.data?.[key]),
    setData: jest.fn(),
    getState: jest.fn((key: string) => overrides.state?.[key]),
    getSession: jest.fn(() => overrides.session ?? {}),
    getRequestParam: jest.fn((key: string) => overrides.params?.[key]),
  }) as unknown as SentencePlanContext

const createMockGoal = (overrides: Partial<DerivedGoal> = {}): DerivedGoal => ({
  uuid: 'goal-uuid-1',
  title: 'Test goal',
  status: 'ACTIVE',
  targetDate: '2025-06-01T00:00:00.000Z',
  statusDate: '2025-01-01T00:00:00.000Z',
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

describe('goalUtils', () => {
  describe('calculateTargetDate()', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-03-15T12:00:00.000Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return null when canStartNow is not yes', () => {
      // Arrange
      const canStartNow = 'no'

      // Act
      const result = calculateTargetDate(canStartNow, 'date_in_3_months')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when canStartNow is empty', () => {
      // Arrange / Act
      const result = calculateTargetDate('', 'date_in_3_months')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when all arguments are omitted', () => {
      // Arrange / Act
      const result = calculateTargetDate()

      // Assert
      expect(result).toBeNull()
    })

    it('should add 3 months when target date option is date_in_3_months', () => {
      // Arrange
      const expected = new Date('2025-03-15T12:00:00.000Z')
      expected.setMonth(expected.getMonth() + 3)

      // Act
      const result = calculateTargetDate('yes', 'date_in_3_months')

      // Assert
      expect(result).toBe(expected.toISOString())
    })

    it('should add 6 months when target date option is date_in_6_months', () => {
      // Arrange
      const expected = new Date('2025-03-15T12:00:00.000Z')
      expected.setMonth(expected.getMonth() + 6)

      // Act
      const result = calculateTargetDate('yes', 'date_in_6_months')

      // Assert
      expect(result).toBe(expected.toISOString())
    })

    it('should add 12 months when target date option is date_in_12_months', () => {
      // Arrange
      const expected = new Date('2025-03-15T12:00:00.000Z')
      expected.setMonth(expected.getMonth() + 12)

      // Act
      const result = calculateTargetDate('yes', 'date_in_12_months')

      // Assert
      expect(result).toBe(expected.toISOString())
    })

    it('should handle year boundary when adding months crosses into next year', () => {
      // Arrange
      jest.setSystemTime(new Date('2025-11-10T12:00:00.000Z'))
      const expected = new Date('2025-11-10T12:00:00.000Z')
      expected.setMonth(expected.getMonth() + 3)

      // Act
      const result = calculateTargetDate('yes', 'date_in_3_months')

      // Assert
      const resultDate = new Date(result!)

      expect(resultDate.getFullYear()).toBe(2026)
      expect(resultDate.getMonth()).toBe(1) // February (0-indexed)
    })

    it('should return custom date ISO string when set_another_date with custom date', () => {
      // Arrange
      const customDate = '2026-01-15'

      // Act
      const result = calculateTargetDate('yes', 'set_another_date', customDate)

      // Assert
      expect(result).toBe(new Date('2026-01-15').toISOString())
    })

    it('should return null when set_another_date but custom date is empty', () => {
      // Arrange / Act
      const result = calculateTargetDate('yes', 'set_another_date', '')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when target date option is unrecognised', () => {
      // Arrange / Act
      const result = calculateTargetDate('yes', 'unknown_option')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when canStartNow is yes but no option or custom date given', () => {
      // Arrange / Act
      const result = calculateTargetDate('yes', '', '')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getMatchingTargetDateOption()', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-03-15T12:00:00.000Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return date_in_3_months when target date is exactly 3 months from now', () => {
      // Arrange
      const targetDate = new Date()
      targetDate.setMonth(targetDate.getMonth() + 3)

      // Act
      const result = getMatchingTargetDateOption(targetDate.toISOString())

      // Assert
      expect(result).toBe('date_in_3_months')
    })

    it('should return date_in_6_months when target date is exactly 6 months from now', () => {
      // Arrange
      const targetDate = new Date()
      targetDate.setMonth(targetDate.getMonth() + 6)

      // Act
      const result = getMatchingTargetDateOption(targetDate.toISOString())

      // Assert
      expect(result).toBe('date_in_6_months')
    })

    it('should return date_in_12_months when target date is exactly 12 months from now', () => {
      // Arrange
      const targetDate = new Date()
      targetDate.setMonth(targetDate.getMonth() + 12)

      // Act
      const result = getMatchingTargetDateOption(targetDate.toISOString())

      // Assert
      expect(result).toBe('date_in_12_months')
    })

    it('should return null when target date does not match any option', () => {
      // Arrange
      const targetDate = new Date('2027-07-20')

      // Act
      const result = getMatchingTargetDateOption(targetDate.toISOString())

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when target date differs by one day from an option', () => {
      // Arrange
      const targetDate = new Date()
      targetDate.setMonth(targetDate.getMonth() + 3)
      targetDate.setDate(targetDate.getDate() + 1)

      // Act
      const result = getMatchingTargetDateOption(targetDate.toISOString())

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('determineGoalStatus()', () => {
    it('should return ACTIVE when canStartNow is yes', () => {
      // Arrange / Act
      const result = determineGoalStatus('yes')

      // Assert
      expect(result).toBe('ACTIVE')
    })

    it('should return FUTURE when canStartNow is no', () => {
      // Arrange / Act
      const result = determineGoalStatus('no')

      // Assert
      expect(result).toBe('FUTURE')
    })

    it('should return FUTURE when canStartNow is empty string', () => {
      // Arrange / Act
      const result = determineGoalStatus('')

      // Assert
      expect(result).toBe('FUTURE')
    })

    it('should return FUTURE when canStartNow is omitted', () => {
      // Arrange / Act
      const result = determineGoalStatus()

      // Assert
      expect(result).toBe('FUTURE')
    })

    it('should return FUTURE when canStartNow is any value other than yes', () => {
      // Arrange / Act
      const result = determineGoalStatus('Yes')

      // Assert
      expect(result).toBe('FUTURE')
    })
  })

  describe('buildGoalProperties()', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-03-15T12:00:00.000Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return properties with the given status and current timestamp', () => {
      // Arrange / Act
      const result = buildGoalProperties('ACTIVE')

      // Assert
      expect(result).toEqual({
        status: 'ACTIVE',
        status_date: '2025-03-15T12:00:00.000Z',
      })
    })

    it('should return properties with FUTURE status', () => {
      // Arrange / Act
      const result = buildGoalProperties('FUTURE')

      // Assert
      expect(result.status).toBe('FUTURE')
    })
  })

  describe('buildGoalAnswers()', () => {
    it('should return answers with target date when provided', () => {
      // Arrange
      const targetDate = '2025-06-15T12:00:00.000Z'

      // Act
      const result = buildGoalAnswers('My goal', 'accommodation', ['finances'], targetDate)

      // Assert
      expect(result).toEqual({
        title: 'My goal',
        area_of_need: 'accommodation',
        related_areas_of_need: ['finances'],
        target_date: targetDate,
      })
    })

    it('should omit target_date when it is null', () => {
      // Arrange / Act
      const result = buildGoalAnswers('My goal', 'accommodation', [], null)

      // Assert
      expect(result).toEqual({
        title: 'My goal',
        area_of_need: 'accommodation',
        related_areas_of_need: [],
      })
      expect(result).not.toHaveProperty('target_date')
    })

    it('should handle empty related areas of need', () => {
      // Arrange / Act
      const result = buildGoalAnswers('My goal', 'accommodation', [], '2025-06-15T12:00:00.000Z')

      // Assert
      expect(result.related_areas_of_need).toEqual([])
    })
  })

  describe('getRequiredEffectContext()', () => {
    it('should return user and assessmentUuid when both are present', () => {
      // Arrange
      const user = { id: 'user-1', name: 'Test User', authSource: 'HMPPS_AUTH' as AuthSource }
      const context = createMockContext({
        state: { user },
        data: { assessmentUuid: 'assessment-123' },
      })

      // Act
      const result = getRequiredEffectContext(context, 'testEffect')

      // Assert
      expect(result).toEqual({ user, assessmentUuid: 'assessment-123' })
    })

    it('should throw InternalServerError when user is missing', () => {
      // Arrange
      const context = createMockContext({
        data: { assessmentUuid: 'assessment-123' },
      })

      // Act / Assert
      expect(() => getRequiredEffectContext(context, 'myEffect')).toThrow(InternalServerError)
      expect(() => getRequiredEffectContext(context, 'myEffect')).toThrow('User is required for myEffect')
    })

    it('should throw InternalServerError when assessmentUuid is missing', () => {
      // Arrange
      const user = { id: 'user-1', name: 'Test User', authSource: 'HMPPS_AUTH' as AuthSource }
      const context = createMockContext({
        state: { user },
      })

      // Act / Assert
      expect(() => getRequiredEffectContext(context, 'myEffect')).toThrow(InternalServerError)
      expect(() => getRequiredEffectContext(context, 'myEffect')).toThrow('Assessment UUID is required for myEffect')
    })

    it('should include effect name in the error message', () => {
      // Arrange
      const context = createMockContext()

      // Act / Assert
      expect(() => getRequiredEffectContext(context, 'saveGoal')).toThrow('User is required for saveGoal')
    })
  })

  describe('getPractitionerName()', () => {
    it('should return practitioner display name from session when available', () => {
      // Arrange
      const user = { id: 'user-1', name: 'Fallback Name', authSource: 'HMPPS_AUTH' as AuthSource }
      const context = createMockContext({
        session: { practitionerDetails: { displayName: 'Dr. Smith' } },
      })

      // Act
      const result = getPractitionerName(context, user)

      // Assert
      expect(result).toBe('Dr. Smith')
    })

    it('should fall back to user.name when practitioner display name is not set', () => {
      // Arrange
      const user = { id: 'user-1', name: 'Fallback Name', authSource: 'HMPPS_AUTH' as AuthSource }
      const context = createMockContext({ session: {} })

      // Act
      const result = getPractitionerName(context, user)

      // Assert
      expect(result).toBe('Fallback Name')
    })

    it('should fall back to user.name when practitionerDetails is undefined', () => {
      // Arrange
      const user = { id: 'user-1', name: 'Jane Doe', authSource: 'HMPPS_AUTH' as AuthSource }
      const context = createMockContext({ session: {} })

      // Act
      const result = getPractitionerName(context, user)

      // Assert
      expect(result).toBe('Jane Doe')
    })
  })

  describe('resolveActiveGoalFromRequest()', () => {
    it('should return goal resolution when UUID matches a goal', () => {
      // Arrange
      const goal = createMockGoal({ uuid: 'abc-123' })
      const context = createMockContext({
        params: { uuid: 'abc-123' },
        data: { goals: [goal] },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toEqual({ goalUuid: 'abc-123', activeGoal: goal })
    })

    it('should return null when UUID param is missing', () => {
      // Arrange
      const context = createMockContext({
        params: {},
        data: { goals: [createMockGoal()] },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when UUID param is the literal placeholder :uuid', () => {
      // Arrange
      const context = createMockContext({
        params: { uuid: ':uuid' },
        data: { goals: [createMockGoal()] },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when UUID does not match any goal', () => {
      // Arrange
      const context = createMockContext({
        params: { uuid: 'non-existent-uuid' },
        data: { goals: [createMockGoal({ uuid: 'different-uuid' })] },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when goals data is undefined', () => {
      // Arrange
      const context = createMockContext({
        params: { uuid: 'abc-123' },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when goals data is an empty array', () => {
      // Arrange
      const context = createMockContext({
        params: { uuid: 'abc-123' },
        data: { goals: [] },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toBeNull()
    })

    it('should find the correct goal among multiple goals', () => {
      // Arrange
      const targetGoal = createMockGoal({ uuid: 'target-uuid', title: 'Target goal' })
      const otherGoal = createMockGoal({ uuid: 'other-uuid', title: 'Other goal' })
      const context = createMockContext({
        params: { uuid: 'target-uuid' },
        data: { goals: [otherGoal, targetGoal] },
      })

      // Act
      const result = resolveActiveGoalFromRequest(context)

      // Assert
      expect(result).toEqual({ goalUuid: 'target-uuid', activeGoal: targetGoal })
    })
  })

  describe('setActiveGoalData()', () => {
    it('should call setData with active goal and UUID', () => {
      // Arrange
      const context = createMockContext()
      const goal = createMockGoal({ uuid: 'goal-uuid-1' })

      // Act
      setActiveGoalData(context, { goalUuid: 'goal-uuid-1', activeGoal: goal })

      // Assert
      expect(context.setData).toHaveBeenCalledWith('activeGoal', goal)
      expect(context.setData).toHaveBeenCalledWith('activeGoalUuid', 'goal-uuid-1')
    })
  })

  describe('deriveAreasOfNeedData()', () => {
    const areas: AreaOfNeed[] = [
      { slug: 'accommodation', text: 'Accommodation', value: 'area_accommodation' },
      { slug: 'finances', text: 'Finances', value: 'area_finances' },
      { slug: 'drug-use', text: 'Drug use', value: 'area_drug_use' },
      { slug: 'alcohol-use', text: 'Alcohol use', value: 'area_alcohol_use' },
    ] as AreaOfNeed[]

    it('should return the current area matching the slug', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData(areas, 'accommodation')

      // Assert
      expect(result.currentAreaOfNeed).toEqual(areas[0])
    })

    it('should exclude the current area from otherAreasOfNeed', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData(areas, 'accommodation')

      // Assert
      expect(result.otherAreasOfNeed).not.toContainEqual(expect.objectContaining({ slug: 'accommodation' }))
      expect(result.otherAreasOfNeed).toHaveLength(3)
    })

    it('should sort otherAreasOfNeed alphabetically by text', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData(areas, 'accommodation')

      // Assert
      const texts = result.otherAreasOfNeed.map(a => a.text)

      expect(texts).toEqual(['Alcohol use', 'Drug use', 'Finances'])
    })

    it('should return all slugs in areaOfNeedSlugs', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData(areas, 'accommodation')

      // Assert
      expect(result.areaOfNeedSlugs).toEqual(['accommodation', 'finances', 'drug-use', 'alcohol-use'])
    })

    it('should return undefined for currentAreaOfNeed when slug does not match', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData(areas, 'non-existent')

      // Assert
      expect(result.currentAreaOfNeed).toBeUndefined()
    })

    it('should return all areas as otherAreasOfNeed when slug does not match any', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData(areas, 'non-existent')

      // Assert
      expect(result.otherAreasOfNeed).toHaveLength(4)
    })

    it('should handle an empty areas array', () => {
      // Arrange / Act
      const result = deriveAreasOfNeedData([], 'accommodation')

      // Assert
      expect(result.currentAreaOfNeed).toBeUndefined()
      expect(result.otherAreasOfNeed).toEqual([])
      expect(result.areaOfNeedSlugs).toEqual([])
    })

    it('should include all areas in otherAreasOfNeed sorted alphabetically when only one area exists and it is not the current', () => {
      // Arrange
      const singleArea = [{ slug: 'finances', text: 'Finances', value: 'area_finances' }] as AreaOfNeed[]

      // Act
      const result = deriveAreasOfNeedData(singleArea, 'accommodation')

      // Assert
      expect(result.otherAreasOfNeed).toHaveLength(1)
      expect(result.otherAreasOfNeed[0].slug).toBe('finances')
    })
  })

  describe('MONTHS_BY_OPTION', () => {
    it('should map date_in_3_months to 3', () => {
      expect(MONTHS_BY_OPTION.date_in_3_months).toBe(3)
    })

    it('should map date_in_6_months to 6', () => {
      expect(MONTHS_BY_OPTION.date_in_6_months).toBe(6)
    })

    it('should map date_in_12_months to 12', () => {
      expect(MONTHS_BY_OPTION.date_in_12_months).toBe(12)
    })
  })
})
