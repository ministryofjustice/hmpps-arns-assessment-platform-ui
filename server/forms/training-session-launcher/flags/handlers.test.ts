import config from '../../../config'
import { getExcludedFields, resolveHandoverConfig, sublabelForEnabledTargets } from './handlers'

jest.mock('../../../config', () => ({
  handoverTargets: { 'sentence-plan': {}, 'strengths-and-needs': {}, 'tiering-assessment': {} },
  forms: { trainingSessionLauncher: { sanTargetEnabled: true } },
}))

// The scenarios modules pull in faker (ESM only), which Jest cannot load, so the pieces handlers.ts uses are stubbed
jest.mock('../scenarios', () => ({
  getFieldsByGroup: () => ['accLinkedToHarm', 'accThreshold'],
}))

jest.mock('../scenarios/helpers', () => ({
  randomOasysAssessmentPk: jest.fn(),
}))

describe('flag handlers', () => {
  describe('resolveHandoverConfig()', () => {
    afterEach(() => {
      config.forms.trainingSessionLauncher.sanTargetEnabled = true
    })

    it('should offer the SAN target for SAN Private Beta when the SAN target is enabled', () => {
      const { availableServices } = resolveHandoverConfig(['SAN_BETA'])

      expect(availableServices).toEqual(['sentence-plan', 'strengths-and-needs'])
    })

    it('should not offer the SAN target for SAN Private Beta when the SAN target is disabled', () => {
      config.forms.trainingSessionLauncher.sanTargetEnabled = false

      const { availableServices } = resolveHandoverConfig(['SAN_BETA', 'TIERING_ASSESSMENT'])

      expect(availableServices).toEqual(['sentence-plan', 'tiering-assessment'])
    })
  })

  describe('sublabelForEnabledTargets()', () => {
    afterEach(() => {
      config.forms.trainingSessionLauncher.sanTargetEnabled = true
    })

    it('should keep the SAN start point when the SAN target is enabled', () => {
      expect(sublabelForEnabledTargets('Prison case study, starts at Sentence Plan or SAN')).toBe(
        'Prison case study, starts at Sentence Plan or SAN',
      )
    })

    it('should drop the SAN start point when the SAN target is disabled', () => {
      config.forms.trainingSessionLauncher.sanTargetEnabled = false

      expect(sublabelForEnabledTargets('Prison case study, starts at Sentence Plan or SAN')).toBe(
        'Prison case study, starts at Sentence Plan',
      )
    })
  })

  describe('getExcludedFields()', () => {
    it('should keep criminogenic needs for a scenario that does not set the mocks setting', () => {
      const flags: [] = []

      const excludedFields = getExcludedFields(flags, {})

      expect(excludedFields.size).toBe(0)
    })

    it('should keep criminogenic needs when the mocks are on', () => {
      const fixedValues = { useMockedCriminogenicNeeds: 'YES' } as const

      const excludedFields = getExcludedFields([], fixedValues)

      expect(excludedFields.size).toBe(0)
    })

    it('should exclude criminogenic needs when the mocks are off and SAN Private Beta is off', () => {
      const fixedValues = { useMockedCriminogenicNeeds: 'NO' } as const

      const excludedFields = getExcludedFields([], fixedValues)

      expect([...excludedFields]).toEqual(['accLinkedToHarm', 'accThreshold'])
    })

    it('should keep criminogenic needs when the mocks are off but SAN Private Beta is on', () => {
      const fixedValues = { useMockedCriminogenicNeeds: 'NO' } as const

      const excludedFields = getExcludedFields(['SAN_BETA'], fixedValues)

      expect(excludedFields.size).toBe(0)
    })
  })
})
