import config from '../../../config'
import { getPresetById, resolvePreset, scenarioPresets } from './presets'
import { resolveHandoverConfig } from '../flags/handlers'

jest.mock('../../../config', () => ({
  handoverTargets: {
    'sentence-plan': { clientId: 'sentence-plan', displayName: 'Sentence Plan' },
    'strengths-and-needs': { clientId: 'strengths-and-needs-assessment', displayName: 'Strengths and Needs (SAN)' },
  },
  forms: { trainingSessionLauncher: { sanTargetEnabled: true } },
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
  afterEach(() => {
    config.forms.trainingSessionLauncher.sanTargetEnabled = true
  })

  it('should have unique ids', () => {
    const ids = scenarioPresets.map(preset => preset.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(scenarioPresets.map(preset => [preset.id, preset] as const))(
    'should say where %s starts in its sublabel, matching the services its flags offer',
    (_id, preset) => {
      const { availableServices } = resolveHandoverConfig(preset.flags)
      const expectedStart = availableServices.includes('strengths-and-needs')
        ? 'starts at Sentence Plan or SAN'
        : 'starts at Sentence Plan'

      expect(preset.shortDescription).toMatch(new RegExp(`, ${expectedStart}$`))
    },
  )

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

    it('should resolve its fixed values and the SAN_BETA flag', () => {
      const resolved = resolvePreset(getPresetById(id)!, 123)

      expect(resolved.id).toBe(id)
      expect(resolved.seed).toBe(123)
      expect(resolved.flags).toEqual(['SAN_BETA'])
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

    it('should still be listed but offer only Sentence Plan when the SAN target is disabled', () => {
      config.forms.trainingSessionLauncher.sanTargetEnabled = false

      const { availableServices } = resolveHandoverConfig(getPresetById(id)!.flags)

      expect(scenarioPresets.map(preset => preset.id)).toContain(id)
      expect(availableServices).toEqual(['sentence-plan'])
    })
  })
})
