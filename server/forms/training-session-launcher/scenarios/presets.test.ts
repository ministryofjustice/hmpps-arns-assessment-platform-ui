import { getPresetById, resolvePreset, scenarioPresets } from './presets'
import { resolveHandoverConfig } from '../flags/handlers'

jest.mock('../../../config', () => ({
  handoverTargets: {
    'sentence-plan': { clientId: 'sentence-plan', displayName: 'Sentence Plan' },
    'strengths-and-needs': { clientId: 'strengths-and-needs-assessment', displayName: 'Strengths and Needs (SAN)' },
  },
}))

// The scenarios modules pull in faker (ESM only), which Jest cannot load, so randomisation is stubbed
jest.mock('./helpers', () => ({
  generateSeed: () => 42,
  randomOasysAssessmentPk: jest.fn(),
  randomScore: () => jest.fn(),
}))

jest.mock('./index', () => ({
  applyRandomization: (fixedValues: Record<string, unknown>, randomizeFields: string[]) => ({
    ...Object.fromEntries(randomizeFields.map(field => [field, `random-${field}`])),
    ...fixedValues,
  }),
  getFieldsByGroup: () => [] as string[],
}))

describe('scenario presets', () => {
  it('should have unique ids', () => {
    const ids = scenarioPresets.map(preset => preset.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  describe.each([
    {
      id: 'san-v2-community',
      name: 'SAN v2 Community',
      expectedValues: {
        givenName: 'Charlie',
        familyName: 'Patterson',
        dateOfBirth: '1995-07-19',
        gender: '1',
        location: 'COMMUNITY',
        sexuallyMotivatedOffenceHistory: 'NO',
        accessMode: 'READ_WRITE',
        planAccessMode: 'READ_WRITE',
      },
    },
    {
      id: 'san-v2-prison',
      name: 'SAN v2 Prison',
      expectedValues: {
        givenName: 'Phillip',
        familyName: 'Jones',
        dateOfBirth: '1985-10-27',
        gender: '1',
        pnc: '15/123457V',
        location: 'PRISON',
        sexuallyMotivatedOffenceHistory: 'NO',
        accessMode: 'READ_WRITE',
        planAccessMode: 'READ_WRITE',
      },
    },
  ])('$name preset', ({ id, name, expectedValues }) => {
    it('should be registered', () => {
      expect(getPresetById(id)?.name).toBe(name)
    })

    it('should resolve its fixed values and the SAN Private Beta flag', () => {
      const resolved = resolvePreset(getPresetById(id)!, 123)

      expect(resolved.id).toBe(id)
      expect(resolved.seed).toBe(123)
      expect(resolved.flags).toEqual(['SAN_PRIVATE_BETA'])
      expect(resolved.values).toMatchObject(expectedValues)
    })

    it('should randomise the CRN and OASys assessment PK so each launch gets its own case', () => {
      const resolved = resolvePreset(getPresetById(id)!)

      expect(resolved.randomizeFields).toEqual(expect.arrayContaining(['crn', 'oasysAssessmentPk']))
      Object.keys(expectedValues).forEach(fixedField => expect(resolved.randomizeFields).not.toContain(fixedField))
    })

    it('should offer SAN as well as Sentence Plan at handover', () => {
      const { availableServices } = resolveHandoverConfig(getPresetById(id)!.flags)

      expect(availableServices).toEqual(['sentence-plan', 'strengths-and-needs'])
    })
  })
})
