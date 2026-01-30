import { OasysEquivalent, CriminogenicNeedsData } from '../interfaces/coordinator-api/entityAssessment'
import {
  transformAssessmentData,
  formatAssessmentAreas,
  processAssessmentInfo,
  getMotivationDisplayText,
} from './assessmentUtils'

describe('assessmentUtils', () => {
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
    accommodation: { linkedToHarm: true, linkedToReoffending: false, score: 4 },
    educationTrainingEmployability: { linkedToHarm: false, linkedToReoffending: true, score: 3 },
    finance: { linkedToHarm: false, linkedToReoffending: false, score: null },
    drugMisuse: { linkedToHarm: false, linkedToReoffending: true, score: 5 },
    alcoholMisuse: { linkedToHarm: true, linkedToReoffending: true, score: 3 },
    healthAndWellbeing: { linkedToHarm: false, linkedToReoffending: false, score: null },
    personalRelationshipsAndCommunity: { linkedToHarm: true, linkedToReoffending: true, score: 7 },
    thinkingBehaviourAndAttitudes: { linkedToHarm: true, linkedToReoffending: true, score: 8 },
    ...overrides,
  })

  describe('transformAssessmentData', () => {
    it('should transform OASys equivalent data into assessment areas', () => {
      const oasysEquivalent = createOasysEquivalent()

      const result = transformAssessmentData(oasysEquivalent)

      expect(result).toHaveLength(8)
      expect(result[0].title).toBe('Accommodation')
      expect(result[0].isAssessmentSectionComplete).toBe(true)
      expect(result[0].linkedToHarm).toBe('YES')
      expect(result[0].riskOfSeriousHarmDetails).toBe('Risk details for accommodation')
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
        accommodation_practitioner_analysis_risk_of_serious_harm: 'NO',
        accommodation_practitioner_analysis_risk_of_serious_harm_no_details: 'No harm identified',
      })

      const result = transformAssessmentData(oasysEquivalent)

      expect(result[0].linkedToHarm).toBe('NO')
      expect(result[0].riskOfSeriousHarmDetails).toBe('No harm identified')
    })

    it('should parse motivation levels correctly', () => {
      const oasysEquivalent = createOasysEquivalent({
        accommodation_practitioner_analysis_motivation_to_make_changes: 'WANTS_TO_MAKE_CHANGES',
      })

      const result = transformAssessmentData(oasysEquivalent)

      expect(result[0].motivationToMakeChanges).toBe('WANTS_TO_MAKE_CHANGES')
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
    })

    it('should classify high-scoring areas correctly', () => {
      const oasysEquivalent = createOasysEquivalent({
        personal_relationships_community_section_complete: 'YES',
      })
      const crimNeeds = createCriminogenicNeedsData({
        personalRelationshipsAndCommunity: { linkedToHarm: true, linkedToReoffending: true, score: 7 },
      })

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      const personalRelationships = result.find(a => a.title === 'Personal relationships and community')
      expect(personalRelationships?.score).toBe(7)
      expect(personalRelationships?.upperBound).toBe(6)
      expect(personalRelationships?.isHighScoring).toBe(true)
      expect(personalRelationships?.isLowScoring).toBe(false)
    })

    it('should classify low-scoring areas correctly', () => {
      const oasysEquivalent = createOasysEquivalent()
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: { linkedToHarm: false, linkedToReoffending: false, score: 2 },
      })

      const result = transformAssessmentData(oasysEquivalent, crimNeeds)

      expect(result[0].score).toBe(2)
      expect(result[0].isHighScoring).toBe(false)
      expect(result[0].isLowScoring).toBe(true)
    })

    it('should handle areas without scoring (Finance, Health)', () => {
      const oasysEquivalent = createOasysEquivalent({
        finance_section_complete: 'YES',
        health_wellbeing_section_complete: 'YES',
      })

      const result = transformAssessmentData(oasysEquivalent)

      const finance = result.find(a => a.title === 'Finances')
      const health = result.find(a => a.title === 'Health and wellbeing')

      expect(finance?.upperBound).toBeNull()
      expect(finance?.isHighScoring).toBe(false)
      expect(finance?.isLowScoring).toBe(false)

      expect(health?.upperBound).toBeNull()
      expect(health?.isHighScoring).toBe(false)
      expect(health?.isLowScoring).toBe(false)
    })
  })

  describe('formatAssessmentAreas', () => {
    it('should group incomplete areas', () => {
      const areas = transformAssessmentData({
        accommodation_section_complete: 'NO',
        employment_education_section_complete: 'YES',
      })

      const result = formatAssessmentAreas(areas)

      expect(result.incompleteAreas.length).toBeGreaterThan(0)
      expect(result.incompleteAreas.some(a => a.title === 'Accommodation')).toBe(true)
    })

    it('should group high-scoring areas', () => {
      const oasysEquivalent: OasysEquivalent = {
        thinking_behaviours_attitudes_section_complete: 'YES',
      }
      const crimNeeds = createCriminogenicNeedsData({
        thinkingBehaviourAndAttitudes: { linkedToHarm: true, linkedToReoffending: true, score: 10 },
      })

      const areas = transformAssessmentData(oasysEquivalent, crimNeeds)
      const result = formatAssessmentAreas(areas)

      expect(result.highScoring.some(a => a.title === 'Thinking, behaviours and attitudes')).toBe(true)
    })

    it('should group low-scoring areas', () => {
      const oasysEquivalent: OasysEquivalent = {
        accommodation_section_complete: 'YES',
      }
      const crimNeeds = createCriminogenicNeedsData({
        accommodation: { linkedToHarm: false, linkedToReoffending: false, score: 2 },
      })

      const areas = transformAssessmentData(oasysEquivalent, crimNeeds)
      const result = formatAssessmentAreas(areas)

      expect(result.lowScoring.some(a => a.title === 'Accommodation')).toBe(true)
    })

    it('should group non-scoring areas into other', () => {
      const oasysEquivalent: OasysEquivalent = {
        finance_section_complete: 'YES',
        health_wellbeing_section_complete: 'YES',
      }

      const areas = transformAssessmentData(oasysEquivalent)
      const result = formatAssessmentAreas(areas)

      expect(result.other.some(a => a.title === 'Finances')).toBe(true)
      expect(result.other.some(a => a.title === 'Health and wellbeing')).toBe(true)
    })
  })

  describe('processAssessmentInfo', () => {
    it('should transform and format in one call', () => {
      const oasysEquivalent = createOasysEquivalent({
        accommodation_section_complete: 'YES',
        finance_section_complete: 'YES',
      })
      const crimNeeds = createCriminogenicNeedsData()

      const result = processAssessmentInfo(oasysEquivalent, crimNeeds)

      expect(result).toHaveProperty('incompleteAreas')
      expect(result).toHaveProperty('highScoring')
      expect(result).toHaveProperty('lowScoring')
      expect(result).toHaveProperty('other')
    })
  })

  describe('getMotivationDisplayText', () => {
    it('should return "Ready to make changes" for READY_TO_MAKE_CHANGES', () => {
      expect(getMotivationDisplayText('READY_TO_MAKE_CHANGES')).toBe('Ready to make changes')
    })

    it('should return "Wants to make changes" for WANTS_TO_MAKE_CHANGES', () => {
      expect(getMotivationDisplayText('WANTS_TO_MAKE_CHANGES')).toBe('Wants to make changes')
    })

    it('should return "Needs help to make changes" for NEEDS_HELP_TO_MAKE_CHANGES', () => {
      expect(getMotivationDisplayText('NEEDS_HELP_TO_MAKE_CHANGES')).toBe('Needs help to make changes')
    })

    it('should return "Does not want to make changes" for DOES_NOT_WANT_TO_MAKE_CHANGES', () => {
      expect(getMotivationDisplayText('DOES_NOT_WANT_TO_MAKE_CHANGES')).toBe('Does not want to make changes')
    })

    it('should return empty string for null', () => {
      expect(getMotivationDisplayText(null)).toBe('')
    })
  })
})
