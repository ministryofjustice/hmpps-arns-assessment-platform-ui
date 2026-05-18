import { SanAssessmentData, CriminogenicNeedsData } from '../interfaces/coordinator-api/entityAssessment'
import { transformAssessmentData } from './assessmentUtils'
import { areasOfNeed } from '../forms/sentence-plan/versions/v1.0/constants'

const areasOfNeedThresholdsAndUpperBounds = Object.fromEntries(
  areasOfNeed.map(area => [area.crimNeedsKey, { threshold: area.threshold, upperBound: area.upperBound }]),
)

describe('assessmentUtils', () => {
  // Note: The SAN assessment data keys (e.g. accommodation_practitioner_analysis_risk_of_serious_harm)
  // come from SAN via the coordinator API, representing raw form answers. Each value is an AnswerDto
  // with a `value` property. We don't use the YES/NO indicator values from these keys - instead we get
  // linked indicators from the handover service (criminogenic needs data, which IS from OASys).
  // We only use these SAN keys for the _details text.
  const createSanAssessmentData = (overrides: Partial<SanAssessmentData> = {}): SanAssessmentData => ({
    accommodation_section_complete: { value: 'YES' },
    accommodation_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
    accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: {
      value: 'Risk details for accommodation',
    },
    accommodation_practitioner_analysis_risk_of_reoffending: { value: 'NO' },
    accommodation_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
    accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: {
      value: 'Has stable housing history',
    },
    accommodation_changes: { value: 'READY_TO_MAKE_CHANGES' },
    ...overrides,
  })

  const createCriminogenicNeedsData = (overrides: Partial<CriminogenicNeedsData> = {}): CriminogenicNeedsData => ({
    accommodation: {
      linkedToHarm: true,
      linkedToReoffending: false,
      linkedToStrengthsOrProtectiveFactors: true,
      score: 4,
    },
    educationTrainingEmployability: {
      linkedToHarm: false,
      linkedToReoffending: true,
      linkedToStrengthsOrProtectiveFactors: false,
      score: 3,
    },
    finance: {
      linkedToHarm: false,
      linkedToReoffending: false,
      linkedToStrengthsOrProtectiveFactors: null,
      score: null,
    },
    drugMisuse: {
      linkedToHarm: false,
      linkedToReoffending: true,
      linkedToStrengthsOrProtectiveFactors: false,
      score: 5,
    },
    alcoholMisuse: {
      linkedToHarm: true,
      linkedToReoffending: true,
      linkedToStrengthsOrProtectiveFactors: false,
      score: 3,
    },
    healthAndWellbeing: {
      linkedToHarm: false,
      linkedToReoffending: false,
      linkedToStrengthsOrProtectiveFactors: null,
      score: null,
    },
    personalRelationshipsAndCommunity: {
      linkedToHarm: true,
      linkedToReoffending: true,
      linkedToStrengthsOrProtectiveFactors: false,
      score: 7,
    },
    thinkingBehaviourAndAttitudes: {
      linkedToHarm: true,
      linkedToReoffending: true,
      linkedToStrengthsOrProtectiveFactors: false,
      score: 8,
    },
    lifestyleAndAssociates: {
      linkedToHarm: false,
      linkedToReoffending: false,
      linkedToStrengthsOrProtectiveFactors: false,
      score: 2,
    },
    ...overrides,
  })

  describe('transformAssessmentData', () => {
    it('should transform SAN assessment data into assessment areas', () => {
      const sanAssessmentData = createSanAssessmentData()
      const crimNeeds = createCriminogenicNeedsData()

      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(result).toHaveLength(8)
      expect(accommodationArea.title).toBe('Accommodation')
      expect(accommodationArea.isAssessmentSectionComplete).toBe(true)
      // Linked indicators come from handover (criminogenic needs), not SAN assessment data
      expect(accommodationArea.linkedToHarm).toBe('YES')
      expect(accommodationArea.linkedToReoffending).toBe('NO')
      expect(accommodationArea.linkedToStrengthsOrProtectiveFactors).toBe('YES')
      // Details come from SAN assessment data (coordinator API)
      expect(accommodationArea.riskOfSeriousHarmDetails).toBe('Risk details for accommodation')
    })

    it('should return null for linked indicators when no criminogenic needs data provided', () => {
      const sanAssessmentData = createSanAssessmentData()

      const result = transformAssessmentData(sanAssessmentData)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      // Without criminogenic needs, linked indicators should be null
      expect(accommodationArea.linkedToHarm).toBeNull()
      expect(accommodationArea.linkedToReoffending).toBeNull()
      expect(accommodationArea.linkedToStrengthsOrProtectiveFactors).toBeNull()
      // Section complete still comes from SAN assessment data
      expect(accommodationArea.isAssessmentSectionComplete).toBe(true)
    })

    it('should handle incomplete sections', () => {
      const sanAssessmentData = createSanAssessmentData({
        accommodation_section_complete: { value: 'NO' },
      })

      const result = transformAssessmentData(sanAssessmentData)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.isAssessmentSectionComplete).toBe(false)
    })

    it('should handle missing section complete value', () => {
      const sanAssessmentData: SanAssessmentData = {}

      const result = transformAssessmentData(sanAssessmentData)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.isAssessmentSectionComplete).toBe(false)
    })

    it('should extract NO details when indicator is NO', () => {
      const sanAssessmentData = createSanAssessmentData({
        accommodation_practitioner_analysis_risk_of_serious_harm_no_details: {
          value: 'No harm identified',
        },
      })
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: true,
          score: 4,
        },
      })

      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      // Linked indicator comes from handover, details come from SAN based on that indicator
      expect(accommodationArea.linkedToHarm).toBe('NO')
      expect(accommodationArea.riskOfSeriousHarmDetails).toBe('No harm identified')
    })

    it('should parse motivation levels correctly', () => {
      const sanAssessmentData = createSanAssessmentData({
        accommodation_changes: { value: 'WANT_TO_MAKE_CHANGES' },
      })

      const result = transformAssessmentData(sanAssessmentData)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.motivationToMakeChanges).toBe('WANT_TO_MAKE_CHANGES')
    })

    it('should return null for invalid motivation values', () => {
      const sanAssessmentData = createSanAssessmentData({
        accommodation_changes: { value: 'INVALID_VALUE' },
      })

      const result = transformAssessmentData(sanAssessmentData)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.motivationToMakeChanges).toBeNull()
    })

    it('should include criminogenic needs scores when provided', () => {
      const sanAssessmentData = createSanAssessmentData()
      const crimNeeds = createCriminogenicNeedsData()

      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.score).toBe(4)
      expect(accommodationArea.upperBound).toBe(areasOfNeedThresholdsAndUpperBounds.accommodation.upperBound)
      expect(accommodationArea.threshold).toBe(areasOfNeedThresholdsAndUpperBounds.accommodation.threshold)
    })

    it('should classify high-scoring areas correctly (score > threshold)', () => {
      const sanAssessmentData = createSanAssessmentData({
        personal_relationships_community_section_complete: { value: 'YES' },
      })
      const crimNeeds = createCriminogenicNeedsData({
        personalRelationshipsAndCommunity: {
          linkedToHarm: true,
          linkedToReoffending: true,
          linkedToStrengthsOrProtectiveFactors: false,
          score: 2, // Score of 2 > threshold of 1 = high scoring
        },
      })

      const result = transformAssessmentData(sanAssessmentData, crimNeeds)

      const personalRelationships = result.find(a => a.title === 'Personal relationships and community')
      expect(personalRelationships?.score).toBe(2)
      expect(personalRelationships?.threshold).toBe(
        areasOfNeedThresholdsAndUpperBounds.personalRelationshipsAndCommunity.threshold,
      )
      expect(personalRelationships?.isHighScoring).toBe(true)
      expect(personalRelationships?.isLowScoring).toBe(false)
    })

    it('should classify low-scoring areas correctly (score <= threshold)', () => {
      const sanAssessmentData = createSanAssessmentData()
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: null,
          score: 1, // Score of 1 <= threshold of 1 = low scoring
        },
      })

      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.score).toBe(1)
      expect(accommodationArea.threshold).toBe(areasOfNeedThresholdsAndUpperBounds.accommodation.threshold)
      expect(accommodationArea.isHighScoring).toBe(false)
      expect(accommodationArea.isLowScoring).toBe(true)
    })

    it('should classify score at threshold as low-scoring', () => {
      const sanAssessmentData = createSanAssessmentData()
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: null,
          score: 1, // Score equals threshold of 1 = low scoring (must be > threshold to be high)
        },
      })

      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

      expect(accommodationArea.score).toBe(1)
      expect(accommodationArea.threshold).toBe(areasOfNeedThresholdsAndUpperBounds.accommodation.threshold)
      expect(accommodationArea.isHighScoring).toBe(false)
      expect(accommodationArea.isLowScoring).toBe(true)
    })

    it('should handle areas without scoring (Finance, Health) - both flags false', () => {
      const sanAssessmentData = createSanAssessmentData({
        finance_section_complete: { value: 'YES' },
        health_wellbeing_section_complete: { value: 'YES' },
      })

      const result = transformAssessmentData(sanAssessmentData)

      const finance = result.find(a => a.title === 'Finances')
      const health = result.find(a => a.title === 'Health and wellbeing')

      // Areas without scoring have both isHighScoring and isLowScoring as false
      expect(finance?.upperBound).toBeNull()
      expect(finance?.threshold).toBeNull()
      expect(finance?.isHighScoring).toBe(false)
      expect(finance?.isLowScoring).toBe(false)

      expect(health?.upperBound).toBeNull()
      expect(health?.threshold).toBeNull()
      expect(health?.isHighScoring).toBe(false)
      expect(health?.isLowScoring).toBe(false)
    })

    it('should handle areas with sub-areas correctly - high-scoring sub area should mark main area as isHighScoring ', () => {
      const sanAssessmentData = createSanAssessmentData()
      const crimNeeds = createCriminogenicNeedsData({
        thinkingBehaviourAndAttitudes: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: false,
          score: 0,
        },
        lifestyleAndAssociates: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: false,
          score: 2,
        },
      })
      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const thinkingBehavioursAttitudesArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

      expect(thinkingBehavioursAttitudesArea?.isHighScoring).toBe(true)
      expect(thinkingBehavioursAttitudesArea?.isLowScoring).toBe(false)
    })

    it('should handle areas with sub-areas correctly - low-scoring main area is classified as isLowScoring if sub area score = threshold', () => {
      const sanAssessmentData = createSanAssessmentData()
      const crimNeeds = createCriminogenicNeedsData({
        thinkingBehaviourAndAttitudes: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: false,
          score: 0,
        },
        lifestyleAndAssociates: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: false,
          score: 1,
        },
      })
      const result = transformAssessmentData(sanAssessmentData, crimNeeds)
      const thinkingBehavioursAttitudesArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

      expect(thinkingBehavioursAttitudesArea?.isHighScoring).toBe(false)
      expect(thinkingBehavioursAttitudesArea?.isLowScoring).toBe(true)
    })

    describe('effectiveScoreToThresholdDistance calculation', () => {
      it('should set effectiveDistance to (score - threshold) for areas without sub-areas', () => {
        const sanAssessmentData = createSanAssessmentData()
        const crimNeeds = createCriminogenicNeedsData({
          accommodation: {
            linkedToHarm: true,
            linkedToReoffending: false,
            linkedToStrengthsOrProtectiveFactors: true,
            score: 4, // threshold is 1, so distance = 4 - 1 = 3
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

        expect(accommodationArea?.score).toBe(4)
        expect(accommodationArea?.threshold).toBe(1)
        expect(accommodationArea?.effectiveScoreToThresholdDistance).toBe(3)
      })

      it('should use sub-area distance when sub-area has greater excess over its threshold', () => {
        const sanAssessmentData = createSanAssessmentData({
          thinking_behaviours_attitudes_section_complete: { value: 'YES' },
        })
        const crimNeeds = createCriminogenicNeedsData({
          thinkingBehaviourAndAttitudes: {
            linkedToHarm: true,
            linkedToReoffending: true,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 2, // at threshold of 2, distance = 0
          },
          lifestyleAndAssociates: {
            linkedToHarm: true,
            linkedToReoffending: true,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 4, // above threshold of 1, distance = 3
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const thinkingArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

        expect(thinkingArea?.score).toBe(2)
        expect(thinkingArea?.threshold).toBe(2)
        expect(thinkingArea?.subArea?.score).toBe(4)
        expect(thinkingArea?.subArea?.threshold).toBe(1)
        expect(thinkingArea?.effectiveScoreToThresholdDistance).toBe(3) // MAX(0, 3) = 3
        expect(thinkingArea?.isHighScoring).toBe(true)
      })

      it('should use main area distance when main area has greater excess over threshold', () => {
        const sanAssessmentData = createSanAssessmentData({
          thinking_behaviours_attitudes_section_complete: { value: 'YES' },
        })
        const crimNeeds = createCriminogenicNeedsData({
          thinkingBehaviourAndAttitudes: {
            linkedToHarm: true,
            linkedToReoffending: true,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 8, // threshold 2, distance = 6
          },
          lifestyleAndAssociates: {
            linkedToHarm: false,
            linkedToReoffending: false,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 3, // threshold 1, distance = 2
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const thinkingArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

        expect(thinkingArea?.score).toBe(8)
        expect(thinkingArea?.subArea?.score).toBe(3)
        expect(thinkingArea?.effectiveScoreToThresholdDistance).toBe(6) // MAX(6, 2) = 6
      })

      it('should use positive sub-area distance when main area distance is negative (below threshold)', () => {
        const sanAssessmentData = createSanAssessmentData({
          thinking_behaviours_attitudes_section_complete: { value: 'YES' },
        })
        const crimNeeds = createCriminogenicNeedsData({
          thinkingBehaviourAndAttitudes: {
            linkedToHarm: true,
            linkedToReoffending: true,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 1, // below threshold of 2, distance = -1
          },
          lifestyleAndAssociates: {
            linkedToHarm: true,
            linkedToReoffending: true,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 4, // above threshold of 1, distance = 3
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const thinkingArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

        expect(thinkingArea?.score).toBe(1)
        expect(thinkingArea?.threshold).toBe(2)
        expect(thinkingArea?.subArea?.score).toBe(4)
        expect(thinkingArea?.subArea?.threshold).toBe(1)
        expect(thinkingArea?.effectiveScoreToThresholdDistance).toBe(3) // MAX(-1, 3) = 3
        expect(thinkingArea?.isHighScoring).toBe(true) // pushed by lifestyle
      })

      it('should use positive main area distance when sub-area distance is negative', () => {
        const sanAssessmentData = createSanAssessmentData({
          thinking_behaviours_attitudes_section_complete: { value: 'YES' },
        })
        const crimNeeds = createCriminogenicNeedsData({
          thinkingBehaviourAndAttitudes: {
            linkedToHarm: true,
            linkedToReoffending: true,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 5, // above threshold of 2, distance = 3
          },
          lifestyleAndAssociates: {
            linkedToHarm: false,
            linkedToReoffending: false,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 0, // below threshold of 1, distance = -1
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const thinkingArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

        expect(thinkingArea?.score).toBe(5)
        expect(thinkingArea?.subArea?.score).toBe(0)
        expect(thinkingArea?.effectiveScoreToThresholdDistance).toBe(3) // MAX(3, -1) = 3
        expect(thinkingArea?.isHighScoring).toBe(true) // high due to main area
      })

      it('should return least negative distance when both distances are negative', () => {
        const sanAssessmentData = createSanAssessmentData({
          thinking_behaviours_attitudes_section_complete: { value: 'YES' },
        })
        const crimNeeds = createCriminogenicNeedsData({
          thinkingBehaviourAndAttitudes: {
            linkedToHarm: false,
            linkedToReoffending: false,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 0, // below threshold of 2, distance = -2
          },
          lifestyleAndAssociates: {
            linkedToHarm: false,
            linkedToReoffending: false,
            linkedToStrengthsOrProtectiveFactors: false,
            score: 0, // below threshold of 1, distance = -1
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const thinkingArea = result.find(a => a.goalRoute === 'thinking-behaviours-and-attitudes')

        expect(thinkingArea?.score).toBe(0)
        expect(thinkingArea?.subArea?.score).toBe(0)
        expect(thinkingArea?.effectiveScoreToThresholdDistance).toBe(-1) // MAX(-2, -1) = -1
        expect(thinkingArea?.isHighScoring).toBe(false) // neither exceeds threshold
        expect(thinkingArea?.isLowScoring).toBe(true)
      })

      it('should set effectiveScoreToThresholdDistance to null when score is null', () => {
        const sanAssessmentData = createSanAssessmentData()
        const crimNeeds = createCriminogenicNeedsData({
          accommodation: {
            linkedToHarm: false,
            linkedToReoffending: false,
            linkedToStrengthsOrProtectiveFactors: null,
            score: null,
          },
        })

        const result = transformAssessmentData(sanAssessmentData, crimNeeds)
        const accommodationArea = result.find(a => a.goalRoute === 'accommodation')

        expect(accommodationArea?.score).toBeNull()
        expect(accommodationArea?.effectiveScoreToThresholdDistance).toBeNull()
      })

      it('should set effectiveScoreToThresholdDistance to null for areas without threshold (Finance, Health)', () => {
        const sanAssessmentData = createSanAssessmentData({
          finance_section_complete: { value: 'YES' },
        })

        const result = transformAssessmentData(sanAssessmentData)
        const financeArea = result.find(a => a.title === 'Finances')

        expect(financeArea?.threshold).toBeNull()
        expect(financeArea?.effectiveScoreToThresholdDistance).toBeNull()
      })
    })
  })
})
