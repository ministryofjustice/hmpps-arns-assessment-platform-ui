import { mapArnsIntegrationNeedsToCriminogenicNeeds } from './arnsIntegrationMapper'
import { AssessmentNeedDetailDto, AssessmentNeedsDetailsDto } from '../interfaces/arns-api/assessmentNeedsDetails'
import { AssessmentVersion } from '../interfaces/arns-api/assessmentNeeds'
import { CriminogenicNeedArea } from '../interfaces/coordinator-api/entityAssessment'

const buildDto = (
  needs: AssessmentNeedDetailDto[],
  assessmentVersion: AssessmentVersion = 'SAN',
): AssessmentNeedsDetailsDto => ({ needs, assessmentVersion })

const emptyArea: CriminogenicNeedArea = {
  linkedToHarm: null,
  linkedToReoffending: null,
  linkedToStrengthsOrProtectiveFactors: null,
  score: null,
}

describe('arnsIntegrationMapper', () => {
  describe('mapArnsIntegrationNeedsToCriminogenicNeeds()', () => {
    it('should return null when the dto is undefined', () => {
      const dto: AssessmentNeedsDetailsDto | undefined = undefined

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result).toBeNull()
    })

    it('should map a section to its internal key with score and risk indicators', () => {
      const dto = buildDto([{ section: 'ACCOMMODATION', riskOfHarm: true, riskOfReoffending: false, score: 6 }])

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation).toEqual({
        linkedToHarm: true,
        linkedToReoffending: false,
        linkedToStrengthsOrProtectiveFactors: null,
        score: 6,
      })
    })

    it('should map every SAN section name, including finance and health-and-wellbeing which this endpoint returns', () => {
      const dto = buildDto([
        { section: 'ACCOMMODATION', score: 1 },
        { section: 'EMPLOYMENT_AND_EDUCATION', score: 2 },
        { section: 'PERSONAL_RELATIONSHIPS_AND_COMMUNITY', score: 3 },
        { section: 'LIFESTYLE_AND_ASSOCIATES', score: 4 },
        { section: 'DRUG_USE', score: 5 },
        { section: 'ALCOHOL_USE', score: 6 },
        { section: 'THINKING_ATTITUDES_AND_BEHAVIOUR', score: 7 },
        { section: 'FINANCE', needStatus: 'UNSCORED_NEED', riskOfHarm: true, riskOfReoffending: false },
        { section: 'HEALTH_AND_WELLBEING', needStatus: 'UNSCORED_NEED', riskOfHarm: false, riskOfReoffending: true },
      ])

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      // Assert
      expect(result?.accommodation.score).toBe(1)
      expect(result?.educationTrainingEmployability.score).toBe(2)
      expect(result?.personalRelationshipsAndCommunity.score).toBe(3)
      expect(result?.lifestyleAndAssociates?.score).toBe(4)
      expect(result?.drugMisuse.score).toBe(5)
      expect(result?.alcoholMisuse.score).toBe(6)
      expect(result?.thinkingBehaviourAndAttitudes.score).toBe(7)
      expect(result?.finance).toEqual({
        linkedToHarm: true,
        linkedToReoffending: false,
        linkedToStrengthsOrProtectiveFactors: null,
        score: null,
      })
      expect(result?.healthAndWellbeing).toEqual({
        linkedToHarm: false,
        linkedToReoffending: true,
        linkedToStrengthsOrProtectiveFactors: null,
        score: null,
      })
    })

    it('should map every OASYS section name to the same internal keys as their SAN equivalents', () => {
      // Arrange
      const dto = buildDto(
        [
          { section: 'ACCOMMODATION', score: 1 },
          { section: 'EDUCATION_TRAINING_AND_EMPLOYABILITY', score: 2 },
          { section: 'RELATIONSHIPS', score: 3 },
          { section: 'LIFESTYLE_AND_ASSOCIATES', score: 4 },
          { section: 'DRUG_MISUSE', score: 5 },
          { section: 'ALCOHOL_MISUSE', score: 6 },
          { section: 'THINKING_AND_BEHAVIOUR', score: 7 },
          { section: 'FINANCE', riskOfHarm: true, riskOfReoffending: true },
          { section: 'EMOTIONAL_WELLBEING', riskOfHarm: true, riskOfReoffending: false },
        ],
        'OASYS',
      )

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.score).toBe(1)
      expect(result?.educationTrainingEmployability.score).toBe(2)
      expect(result?.personalRelationshipsAndCommunity.score).toBe(3)
      expect(result?.lifestyleAndAssociates?.score).toBe(4)
      expect(result?.drugMisuse.score).toBe(5)
      expect(result?.alcoholMisuse.score).toBe(6)
      expect(result?.thinkingBehaviourAndAttitudes.score).toBe(7)
      expect(result?.finance.linkedToHarm).toBe(true)
      expect(result?.healthAndWellbeing.linkedToReoffending).toBe(false)
    })

    it('should take THINKING_AND_BEHAVIOUR for the combined thinking area and ignore the separate ATTITUDE section', () => {
      const dto = buildDto(
        [
          { section: 'THINKING_AND_BEHAVIOUR', riskOfHarm: true, riskOfReoffending: true, score: 5 },
          { section: 'ATTITUDE', riskOfHarm: false, riskOfReoffending: false, score: 9 },
        ],
        'OASYS',
      )

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.thinkingBehaviourAndAttitudes).toEqual({
        linkedToHarm: true,
        linkedToReoffending: true,
        linkedToStrengthsOrProtectiveFactors: null,
        score: 5,
      })
    })

    it('should always set linkedToStrengthsOrProtectiveFactors to null as the endpoint provides no strengths data', () => {
      const dto = buildDto([{ section: 'ACCOMMODATION', riskOfHarm: true, riskOfReoffending: true, score: 6 }])

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.linkedToStrengthsOrProtectiveFactors).toBeNull()
    })

    it('should coalesce missing risk and score fields to null', () => {
      const dto = buildDto([{ section: 'ACCOMMODATION' }])

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation).toEqual(emptyArea)
    })

    it('should skip needs with an unrecognised section without throwing', () => {
      const dto = buildDto([
        { section: 'ACCOMMODATION', score: 6 },
        { section: 'NOT_A_REAL_SECTION', score: 9 },
      ])

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.accommodation.score).toBe(6)
    })

    it('should default sections absent from the response to empty areas', () => {
      const dto = buildDto([{ section: 'ACCOMMODATION', score: 6 }])

      const result = mapArnsIntegrationNeedsToCriminogenicNeeds(dto)

      expect(result?.finance).toEqual(emptyArea)
      expect(result?.thinkingBehaviourAndAttitudes).toEqual(emptyArea)
      expect(result?.lifestyleAndAssociates).toBeUndefined()
    })
  })
})
