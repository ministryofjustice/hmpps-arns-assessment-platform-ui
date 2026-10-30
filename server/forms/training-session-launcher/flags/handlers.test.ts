import { getExcludedFields } from './handlers'

jest.mock('../../../config', () => ({
  handoverTargets: {},
}))

// The scenarios modules pull in faker (ESM only), which Jest cannot load, so the pieces handlers.ts uses are stubbed
jest.mock('../scenarios', () => ({
  getFieldsByGroup: () => ['accLinkedToHarm', 'accThreshold'],
}))

jest.mock('../scenarios/helpers', () => ({
  randomOasysAssessmentPk: jest.fn(),
}))

describe('flag handlers', () => {
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

      const excludedFields = getExcludedFields(['SAN_PRIVATE_BETA'], fixedValues)

      expect(excludedFields.size).toBe(0)
    })
  })
})
