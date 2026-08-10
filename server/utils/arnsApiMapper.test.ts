import { mapArnsNeedsToCriminogenicNeeds } from './arnsApiMapper'
import { AssessmentNeedsDto } from '../interfaces/arns-api/assessmentNeeds'
import { CriminogenicNeedArea } from '../interfaces/coordinator-api/entityAssessment'

const buildNeedsDto = (overrides: Partial<AssessmentNeedsDto> = {}): AssessmentNeedsDto => ({
  identifiedNeeds: [],
  notIdentifiedNeeds: [],
  unansweredNeeds: [],
  assessmentVersion: 'SAN',
  ...overrides,
})

const emptyArea: CriminogenicNeedArea = {
  linkedToHarm: null,
  linkedToReoffending: null,
  linkedToStrengthsOrProtectiveFactors: null,
  score: null,
}

describe('arnsApiMapper', () => {
  describe('mapArnsNeedsToCriminogenicNeeds()', () => {
    it('should return null when the dto is undefined', () => {
      const dto: AssessmentNeedsDto | undefined = undefined

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result).toBeNull()
    })

    it('should map a section to its internal key with score and risk indicators', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [{ section: 'ACCOMMODATION', riskOfHarm: true, riskOfReoffending: false, score: 6 }],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation).toEqual({
        linkedToHarm: true,
        linkedToReoffending: false,
        linkedToStrengthsOrProtectiveFactors: null,
        score: 6,
      })
    })

    it('should map needs from all three lists when they are spread across identified, notIdentified and unanswered', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [{ section: 'ACCOMMODATION', score: 6 }],
        notIdentifiedNeeds: [{ section: 'ALCOHOL_USE', score: 2 }],
        unansweredNeeds: [{ section: 'DRUG_USE' }],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.score).toBe(6)
      expect(result?.alcoholMisuse.score).toBe(2)
      expect(result?.drugMisuse.score).toBeNull()
    })

    it('should map all seven SAN sections to their internal keys', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [
          { section: 'ACCOMMODATION', score: 1 },
          { section: 'EMPLOYMENT_AND_EDUCATION', score: 2 },
          { section: 'PERSONAL_RELATIONSHIPS_AND_COMMUNITY', score: 3 },
          { section: 'LIFESTYLE_AND_ASSOCIATES', score: 4 },
          { section: 'DRUG_USE', score: 5 },
          { section: 'ALCOHOL_USE', score: 6 },
          { section: 'THINKING_ATTITUDES_AND_BEHAVIOUR', score: 7 },
        ],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.score).toBe(1)
      expect(result?.educationTrainingEmployability.score).toBe(2)
      expect(result?.personalRelationshipsAndCommunity.score).toBe(3)
      expect(result?.lifestyleAndAssociates?.score).toBe(4)
      expect(result?.drugMisuse.score).toBe(5)
      expect(result?.alcoholMisuse.score).toBe(6)
      expect(result?.thinkingBehaviourAndAttitudes.score).toBe(7)
    })

    it('should default finance and health-and-wellbeing to empty areas as SAN omits them', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [{ section: 'ACCOMMODATION', score: 6 }],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.finance).toEqual(emptyArea)
      expect(result?.healthAndWellbeing).toEqual(emptyArea)
    })

    it('should always set linkedToStrengthsOrProtectiveFactors to null as ARNS provides no strengths data', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [{ section: 'ACCOMMODATION', riskOfHarm: true, riskOfReoffending: true, score: 6 }],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.linkedToStrengthsOrProtectiveFactors).toBeNull()
    })

    it('should coalesce missing risk and score fields to null', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [{ section: 'ACCOMMODATION' }],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation).toEqual(emptyArea)
    })

    it('should skip needs with an unrecognised section without throwing', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [
          { section: 'ACCOMMODATION', score: 6 },
          { section: 'NOT_A_REAL_SECTION', score: 9 },
        ],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.score).toBe(6)
    })

    it('should omit lifestyleAndAssociates when no lifestyle section is present', () => {
      const dto = buildNeedsDto({
        identifiedNeeds: [{ section: 'ACCOMMODATION', score: 6 }],
      })

      const result = mapArnsNeedsToCriminogenicNeeds(dto)

      expect(result?.lifestyleAndAssociates).toBeUndefined()
    })
  })
})
