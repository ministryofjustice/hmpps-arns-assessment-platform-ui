import { mapHandoverToCriminogenicNeeds } from './handoverApiMapper'
import { CriminogenicNeedsData as HandoverCriminogenicNeedsData } from '../interfaces/handover-api/shared'

describe('handoverApiMapper', () => {
  describe('mapHandoverToCriminogenicNeeds', () => {
    it('returns null when handover data is undefined', () => {
      expect(mapHandoverToCriminogenicNeeds(undefined)).toBeNull()
    })

    it('extracts scores from handover data', () => {
      const handoverData: HandoverCriminogenicNeedsData = {
        accommodation: {
          accOtherWeightedScore: '4',
        },
        educationTrainingEmployability: {
          eteOtherWeightedScore: '3',
        },
      }

      const result = mapHandoverToCriminogenicNeeds(handoverData)

      expect(result?.accommodation.score).toBe(4)
      expect(result?.educationTrainingEmployability.score).toBe(3)
    })

    it('returns null for invalid score values', () => {
      const handoverData: HandoverCriminogenicNeedsData = {
        accommodation: {
          accOtherWeightedScore: 'N/A',
        },
        drugMisuse: {
          drugOtherWeightedScore: '',
        },
      }

      const result = mapHandoverToCriminogenicNeeds(handoverData)

      expect(result?.accommodation.score).toBeNull()
      expect(result?.drugMisuse.score).toBeNull()
    })

    it('converts linked indicators to boolean', () => {
      const handoverData: HandoverCriminogenicNeedsData = {
        accommodation: {
          accLinkedToHarm: 'YES',
          accLinkedToReoffending: 'NO',
          accStrengths: 'YES',
        },
        drugMisuse: {
          drugLinkedToHarm: 'NULL',
          drugLinkedToReoffending: 'N/A',
          drugStrengths: 'NO',
        },
      }

      const result = mapHandoverToCriminogenicNeeds(handoverData)

      expect(result?.accommodation.linkedToHarm).toBe(true)
      expect(result?.accommodation.linkedToReoffending).toBe(false)
      expect(result?.accommodation.linkedToStrengthsOrProtectiveFactors).toBe(true)
      expect(result?.drugMisuse.linkedToHarm).toBeNull()
      expect(result?.drugMisuse.linkedToReoffending).toBeNull()
      expect(result?.drugMisuse.linkedToStrengthsOrProtectiveFactors).toBe(false)
    })

    it('handles missing area data', () => {
      const handoverData: HandoverCriminogenicNeedsData = {
        accommodation: {
          accLinkedToHarm: 'YES',
          accStrengths: 'NO',
          accOtherWeightedScore: '4',
        },
        // finance is missing
      }

      const result = mapHandoverToCriminogenicNeeds(handoverData)

      expect(result?.accommodation.linkedToHarm).toBe(true)
      expect(result?.accommodation.linkedToStrengthsOrProtectiveFactors).toBe(false)
      expect(result?.accommodation.score).toBe(4)
      expect(result?.finance.linkedToHarm).toBeNull()
      expect(result?.finance.linkedToStrengthsOrProtectiveFactors).toBeNull()
      expect(result?.finance.score).toBeNull()
    })

    it('maps strengths indicators for all areas', () => {
      const handoverData: HandoverCriminogenicNeedsData = {
        accommodation: { accStrengths: 'YES' },
        educationTrainingEmployability: { eteStrengths: 'NO' },
        finance: { financeStrengths: 'NULL' },
        drugMisuse: { drugStrengths: 'N/A' },
        alcoholMisuse: { alcoholStrengths: 'YES' },
        healthAndWellbeing: { emoStrengths: 'NO' },
        personalRelationshipsAndCommunity: { relStrengths: 'YES' },
        thinkingBehaviourAndAttitudes: { thinkStrengths: 'NO' },
      }

      const result = mapHandoverToCriminogenicNeeds(handoverData)

      expect(result?.accommodation.linkedToStrengthsOrProtectiveFactors).toBe(true)
      expect(result?.educationTrainingEmployability.linkedToStrengthsOrProtectiveFactors).toBe(false)
      expect(result?.finance.linkedToStrengthsOrProtectiveFactors).toBeNull()
      expect(result?.drugMisuse.linkedToStrengthsOrProtectiveFactors).toBeNull()
      expect(result?.alcoholMisuse.linkedToStrengthsOrProtectiveFactors).toBe(true)
      expect(result?.healthAndWellbeing.linkedToStrengthsOrProtectiveFactors).toBe(false)
      expect(result?.personalRelationshipsAndCommunity.linkedToStrengthsOrProtectiveFactors).toBe(true)
      expect(result?.thinkingBehaviourAndAttitudes.linkedToStrengthsOrProtectiveFactors).toBe(false)
    })

    it('maps all areas correctly', () => {
      const handoverData: HandoverCriminogenicNeedsData = {
        accommodation: { accOtherWeightedScore: '4', accLinkedToHarm: 'YES' },
        educationTrainingEmployability: { eteOtherWeightedScore: '3', eteLinkedToReoffending: 'YES' },
        finance: { financeLinkedToHarm: 'NO' },
        drugMisuse: { drugOtherWeightedScore: '6' },
        alcoholMisuse: { alcoholOtherWeightedScore: '2' },
        healthAndWellbeing: { emoLinkedToHarm: 'NO' },
        personalRelationshipsAndCommunity: { relOtherWeightedScore: '5' },
        thinkingBehaviourAndAttitudes: { thinkOtherWeightedScore: '7' },
      }

      const result = mapHandoverToCriminogenicNeeds(handoverData)

      expect(result?.accommodation.score).toBe(4)
      expect(result?.accommodation.linkedToHarm).toBe(true)
      expect(result?.educationTrainingEmployability.score).toBe(3)
      expect(result?.educationTrainingEmployability.linkedToReoffending).toBe(true)
      expect(result?.finance.linkedToHarm).toBe(false)
      expect(result?.finance.score).toBeNull()
      expect(result?.drugMisuse.score).toBe(6)
      expect(result?.alcoholMisuse.score).toBe(2)
      expect(result?.healthAndWellbeing.linkedToHarm).toBe(false)
      expect(result?.personalRelationshipsAndCommunity.score).toBe(5)
      expect(result?.thinkingBehaviourAndAttitudes.score).toBe(7)
    })
  })
})
