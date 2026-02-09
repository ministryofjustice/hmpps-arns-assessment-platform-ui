import { EvaluatedBlock } from '@form-engine/form/types/structures.type'
import { AssessmentArea, MotivationLevel } from '../interfaces/coordinator-api/entityAssessment'
import {
  getLinkedText,
  getMotivationText,
  hasAnyData,
  buildParams,
  AssessmentInfoDetailsBlock,
} from '../forms/sentence-plan/components/assessment-info-details/assessmentInfoDetails'

/**
 * Creates a minimal AssessmentArea for testing.
 * All fields default to null/empty unless overridden.
 */
function createAssessmentArea(overrides: Partial<AssessmentArea> = {}): AssessmentArea {
  return {
    title: 'Test Area',
    goalRoute: 'test-area',
    isAssessmentSectionComplete: false,
    linkedToHarm: null,
    linkedToReoffending: null,
    linkedToStrengthsOrProtectiveFactors: null,
    riskOfSeriousHarmDetails: '',
    riskOfReoffendingDetails: '',
    strengthsOrProtectiveFactorsDetails: '',
    motivationToMakeChanges: null,
    score: null,
    upperBound: null,
    threshold: null,
    isHighScoring: false,
    isLowScoring: false,
    ...overrides,
  }
}

describe('Assessment Info Details Component', () => {
  describe('getLinkedText', () => {
    it('returns yesText when indicator is YES', () => {
      expect(getLinkedText('YES', 'is', 'is not')).toBe('is')
      expect(getLinkedText('YES', 'are', 'are no')).toBe('are')
    })

    it('returns noText when indicator is NO', () => {
      expect(getLinkedText('NO', 'is', 'is not')).toBe('is not')
      expect(getLinkedText('NO', 'are', 'are no')).toBe('are no')
    })

    it('returns null when indicator is null', () => {
      expect(getLinkedText(null, 'is', 'is not')).toBeNull()
    })
  })

  describe('getMotivationText', () => {
    const personName = 'John'

    it('returns correct text for MADE_CHANGES', () => {
      expect(getMotivationText('MADE_CHANGES', personName)).toBe(
        'John has already made positive changes and wants to maintain them.',
      )
    })

    it('returns correct text for MAKING_CHANGES', () => {
      expect(getMotivationText('MAKING_CHANGES', personName)).toBe('John is actively making changes.')
    })

    it('returns correct text for WANT_TO_MAKE_CHANGES', () => {
      expect(getMotivationText('WANT_TO_MAKE_CHANGES', personName)).toBe('John wants to make changes and knows how to.')
    })

    it('returns correct text for NEEDS_HELP_TO_MAKE_CHANGES', () => {
      expect(getMotivationText('NEEDS_HELP_TO_MAKE_CHANGES', personName)).toBe(
        'John wants to make changes but needs help.',
      )
    })

    it('returns correct text for THINKING_ABOUT_MAKING_CHANGES', () => {
      expect(getMotivationText('THINKING_ABOUT_MAKING_CHANGES', personName)).toBe(
        'John is thinking about making changes.',
      )
    })

    it('returns correct text for DOES_NOT_WANT_TO_MAKE_CHANGES', () => {
      expect(getMotivationText('DOES_NOT_WANT_TO_MAKE_CHANGES', personName)).toBe('John does not want to make changes.')
    })

    it('returns correct text for DOES_NOT_WANT_TO_ANSWER', () => {
      expect(getMotivationText('DOES_NOT_WANT_TO_ANSWER', personName)).toBe('John does not want to answer.')
    })

    it('returns correct text for NOT_PRESENT', () => {
      expect(getMotivationText('NOT_PRESENT', personName)).toBe('John was not present to answer this question.')
    })

    it('returns correct text for NOT_APPLICABLE (no person name in text)', () => {
      expect(getMotivationText('NOT_APPLICABLE', personName)).toBe('This question was not applicable.')
    })

    it('returns null for unknown motivation value', () => {
      expect(getMotivationText('UNKNOWN_VALUE' as MotivationLevel, personName)).toBeNull()
    })

    it('returns null for null motivation', () => {
      expect(getMotivationText(null as unknown as MotivationLevel, personName)).toBeNull()
    })
  })

  describe('hasAnyData', () => {
    it('returns false for null data', () => {
      expect(hasAnyData(null)).toBe(false)
    })

    it('returns false when all indicators are null', () => {
      const data = createAssessmentArea()
      expect(hasAnyData(data)).toBe(false)
    })

    it('returns true when linkedToHarm is set', () => {
      const data = createAssessmentArea({ linkedToHarm: 'YES' })
      expect(hasAnyData(data)).toBe(true)
    })

    it('returns true when linkedToReoffending is set', () => {
      const data = createAssessmentArea({ linkedToReoffending: 'NO' })
      expect(hasAnyData(data)).toBe(true)
    })

    it('returns true when linkedToStrengthsOrProtectiveFactors is set', () => {
      const data = createAssessmentArea({ linkedToStrengthsOrProtectiveFactors: 'YES' })
      expect(hasAnyData(data)).toBe(true)
    })

    it('returns true when motivationToMakeChanges is set', () => {
      const data = createAssessmentArea({ motivationToMakeChanges: 'WANT_TO_MAKE_CHANGES' })
      expect(hasAnyData(data)).toBe(true)
    })

    it('returns true when multiple indicators are set', () => {
      const data = createAssessmentArea({
        linkedToHarm: 'YES',
        linkedToReoffending: 'YES',
        motivationToMakeChanges: 'MAKING_CHANGES',
      })
      expect(hasAnyData(data)).toBe(true)
    })

    it('returns true when score is set', () => {
      const data = createAssessmentArea({ score: 4, upperBound: 6 })
      expect(hasAnyData(data)).toBe(true)
    })

    it('returns true when section is marked complete even if all indicators are null', () => {
      const data = createAssessmentArea({ isAssessmentSectionComplete: true })
      expect(hasAnyData(data)).toBe(true)
    })
  })

  describe('buildParams', () => {
    function createBlock(
      assessmentData: AssessmentArea | null,
      status = 'success',
    ): EvaluatedBlock<AssessmentInfoDetailsBlock> {
      return {
        variant: 'assessmentInfoDetails',
        personName: 'John',
        areaName: 'Accommodation',
        assessmentData,
        status,
      } as EvaluatedBlock<AssessmentInfoDetailsBlock>
    }

    describe('details for YES and NO responses', () => {
      it('includes roshDetails when linkedToHarm is YES', () => {
        const data = createAssessmentArea({
          linkedToHarm: 'YES',
          riskOfSeriousHarmDetails: 'Details about serious harm risk',
        })
        const params = buildParams(createBlock(data))

        expect(params.roshDetails).toBe('Details about serious harm risk')
      })

      it('includes roshDetails when linkedToHarm is NO', () => {
        const data = createAssessmentArea({
          linkedToHarm: 'NO',
          riskOfSeriousHarmDetails: 'Explanation why not linked to harm',
        })
        const params = buildParams(createBlock(data))

        expect(params.roshDetails).toBe('Explanation why not linked to harm')
      })

      it('excludes roshDetails when linkedToHarm is null', () => {
        const data = createAssessmentArea({
          linkedToHarm: null,
          riskOfSeriousHarmDetails: 'Should not appear',
        })
        const params = buildParams(createBlock(data))

        expect(params.roshDetails).toBeNull()
      })

      it('includes reoffendingDetails when linkedToReoffending is NO', () => {
        const data = createAssessmentArea({
          linkedToReoffending: 'NO',
          riskOfReoffendingDetails: 'Explanation why not linked',
        })
        const params = buildParams(createBlock(data))

        expect(params.reoffendingDetails).toBe('Explanation why not linked')
      })

      it('includes strengthsDetails when linkedToStrengths is NO', () => {
        const data = createAssessmentArea({
          linkedToStrengthsOrProtectiveFactors: 'NO',
          strengthsOrProtectiveFactorsDetails: 'Details about lack of strengths',
        })
        const params = buildParams(createBlock(data))

        expect(params.strengthsDetails).toBe('Details about lack of strengths')
      })
    })
  })
})
