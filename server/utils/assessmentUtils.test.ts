import { OasysEquivalent, CriminogenicNeedsData } from '../interfaces/coordinator-api/entityAssessment'
import { transformAssessmentData } from './assessmentUtils'

describe('assessmentUtils', () => {
  // Note: The OASys equivalent keys (e.g. accommodation_practitioner_analysis_risk_of_serious_harm)
  // come from SAN via the coordinator API, not directly from OASys. These represent practitioner
  // analysis entered in SAN, formatted in an OASys-compatible structure. We don't use the YES/NO
  // indicator values from these keys - instead we get linked indicators from the handover service
  // (criminogenic needs data, which IS from OASys). We only use these SAN keys for the _details text.
  const createOasysEquivalent = (overrides: Partial<OasysEquivalent> = {}): OasysEquivalent => ({
    accommodation_section_complete: 'YES',
    accommodation_practitioner_analysis_risk_of_serious_harm: 'YES',
    accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: 'Risk details for accommodation',
    accommodation_practitioner_analysis_risk_of_reoffending: 'NO',
    accommodation_practitioner_analysis_strengths_or_protective_factors: 'YES',
    accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: 'Has stable housing history',
    accommodation_practitioner_analysis_motivation_to_make_changes: 'READY_TO_MAKE_CHANGES',
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
    ...overrides,
  })

  describe('transformAssessmentData', () => {
    it('should transform OASys equivalent data into assessment areas', () => {
      const oasysEquivalent = createOasysEquivalent()
      const crimNeeds = createCriminogenicNeedsData()

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      expect(result).toHaveLength(8)
      expect(result[0].title).toBe('Accommodation')
      expect(result[0].isAssessmentSectionComplete).toBe(true)
      // Linked indicators come from handover (criminogenic needs), not OASys equivalent
      expect(result[0].linkedToHarm).toBe('YES')
      expect(result[0].linkedToReoffending).toBe('NO')
      expect(result[0].linkedToStrengthsOrProtectiveFactors).toBe('YES')
      // Details come from OASys equivalent (coordinator API)
      expect(result[0].riskOfSeriousHarmDetails).toBe('Risk details for accommodation')
    })

    it('should return null for linked indicators when no criminogenic needs data provided', () => {
      const oasysEquivalent = createOasysEquivalent()

      const result = transformAssessmentData(oasysEquivalent)

      // Without criminogenic needs, linked indicators should be null
      expect(result[0].linkedToHarm).toBeNull()
      expect(result[0].linkedToReoffending).toBeNull()
      expect(result[0].linkedToStrengthsOrProtectiveFactors).toBeNull()
      // Section complete still comes from OASys equivalent
      expect(result[0].isAssessmentSectionComplete).toBe(true)
    })

    it('should handle incomplete sections', () => {
      const oasysEquivalent = createOasysEquivalent({
        accommodation_section_complete: 'NO',
      })

      const result = transformAssessmentData(oasysEquivalent)

      expect(result[0].isAssessmentSectionComplete).toBe(false)
    })

    it('should handle missing section complete value', () => {
      const oasysEquivalent: OasysEquivalent = {}

      const result = transformAssessmentData(oasysEquivalent)

      expect(result[0].isAssessmentSectionComplete).toBe(false)
    })

    it('should extract NO details when indicator is NO', () => {
      const oasysEquivalent = createOasysEquivalent({
        accommodation_practitioner_analysis_risk_of_serious_harm_no_details: 'No harm identified',
      })
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: true,
          score: 4,
        },
      })

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      // Linked indicator comes from handover, details come from OASys based on that indicator
      expect(result[0].linkedToHarm).toBe('NO')
      expect(result[0].riskOfSeriousHarmDetails).toBe('No harm identified')
    })

    it('should parse motivation levels correctly', () => {
      const oasysEquivalent = createOasysEquivalent({
        accommodation_practitioner_analysis_motivation_to_make_changes: 'WANT_TO_MAKE_CHANGES',
      })

      const result = transformAssessmentData(oasysEquivalent)

      expect(result[0].motivationToMakeChanges).toBe('WANT_TO_MAKE_CHANGES')
    })

    it('should return null for invalid motivation values', () => {
      const oasysEquivalent = createOasysEquivalent({
        accommodation_practitioner_analysis_motivation_to_make_changes: 'INVALID_VALUE',
      })

      const result = transformAssessmentData(oasysEquivalent)

      expect(result[0].motivationToMakeChanges).toBeNull()
    })

    it('should include criminogenic needs scores when provided', () => {
      const oasysEquivalent = createOasysEquivalent()
      const crimNeeds = createCriminogenicNeedsData()

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      expect(result[0].score).toBe(4)
      expect(result[0].upperBound).toBe(6)
      expect(result[0].threshold).toBe(1)
    })

    it('should classify high-scoring areas correctly (score > threshold)', () => {
      const oasysEquivalent = createOasysEquivalent({
        personal_relationships_community_section_complete: 'YES',
      })
      const crimNeeds = createCriminogenicNeedsData({
        personalRelationshipsAndCommunity: {
          linkedToHarm: true,
          linkedToReoffending: true,
          linkedToStrengthsOrProtectiveFactors: false,
          score: 2, // Score of 2 > threshold of 1 = high scoring
        },
      })

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      const personalRelationships = result.find(a => a.title === 'Personal relationships and community')
      expect(personalRelationships?.score).toBe(2)
      expect(personalRelationships?.threshold).toBe(1)
      expect(personalRelationships?.isHighScoring).toBe(true)
      expect(personalRelationships?.isLowScoring).toBe(false)
    })

    it('should classify low-scoring areas correctly (score <= threshold)', () => {
      const oasysEquivalent = createOasysEquivalent()
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: null,
          score: 1, // Score of 1 <= threshold of 1 = low scoring
        },
      })

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      expect(result[0].score).toBe(1)
      expect(result[0].threshold).toBe(1)
      expect(result[0].isHighScoring).toBe(false)
      expect(result[0].isLowScoring).toBe(true)
    })

    it('should classify score at threshold as low-scoring', () => {
      const oasysEquivalent = createOasysEquivalent()
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: {
          linkedToHarm: false,
          linkedToReoffending: false,
          linkedToStrengthsOrProtectiveFactors: null,
          score: 1, // Score equals threshold of 1 = low scoring (must be > threshold to be high)
        },
      })

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      expect(result[0].score).toBe(1)
      expect(result[0].threshold).toBe(1)
      expect(result[0].isHighScoring).toBe(false)
      expect(result[0].isLowScoring).toBe(true)
    })

    it('should handle areas without scoring (Finance, Health) - both flags false', () => {
      const oasysEquivalent = createOasysEquivalent({
        finance_section_complete: 'YES',
        health_wellbeing_section_complete: 'YES',
      })

      const result = transformAssessmentData(oasysEquivalent)

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
  })
})
