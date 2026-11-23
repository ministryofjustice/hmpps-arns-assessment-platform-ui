import { createForgePackage, journey, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness, expectRenderOutcome } from '@ministryofjustice/hmpps-forge/core/testing'
import { GovUKCheckboxInput, GovUKTextInput, govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  crnValidation,
  dateOfBirthValidation,
  flagsValidation,
  needScoreValidation,
  oasysAssessmentPkValidation,
  scenarioNameValidation,
  scoreRangePattern,
} from './customiseValidation'

describe('customiseValidation', () => {
  describe('scoreRangePattern()', () => {
    it.each(['0', '3', '6'])('should accept %p for a maximum of 6', score => {
      expect(new RegExp(scoreRangePattern(6)).test(score)).toBe(true)
    })

    it.each(['7', '-1', '06', '2.5', '', ' 3'])('should reject %p for a maximum of 6', score => {
      expect(new RegExp(scoreRangePattern(6)).test(score)).toBe(false)
    })

    it('should accept a two digit maximum', () => {
      expect(new RegExp(scoreRangePattern(10)).test('10')).toBe(true)
      expect(new RegExp(scoreRangePattern(10)).test('11')).toBe(false)
    })
  })

  describe('on the Customise fields', () => {
    const client = new ForgeTestHarness()
      .registerGlobalComponents(govukComponents)
      .registerPackage(
        createForgePackage({
          journey: journey({
            code: 'test',
            title: 'Test',
            path: '/test',
            steps: [
              step({
                path: '/customise',
                title: 'Customise',
                reachability: { entryWhen: true },
                blocks: [
                  GovUKTextInput({ code: 'scenarioName', label: 'Scenario name', validWhen: scenarioNameValidation() }),
                  GovUKTextInput({ code: 'crn', label: 'CRN', validWhen: crnValidation() }),
                  GovUKTextInput({ code: 'oasysAssessmentPk', label: 'PK', validWhen: oasysAssessmentPkValidation() }),
                  GovUKTextInput({ code: 'dateOfBirth', label: 'DOB', validWhen: dateOfBirthValidation() }),
                  GovUKTextInput({
                    code: 'accOtherWeightedScore',
                    label: 'Score',
                    validWhen: needScoreValidation('accOtherWeightedScore', 'Accommodation', 6),
                  }),
                  GovUKCheckboxInput({
                    code: 'flags',
                    validWhen: flagsValidation(),
                    items: [
                      { value: 'MERGED', text: 'Merged' },
                      { value: 'NEW_PERIOD_OF_SUPERVISION', text: 'New period of supervision' },
                    ],
                  }),
                ],
                onSubmission: [submit({ validate: true })],
              }),
            ],
          }),
        }),
      )
      .createClient()

    const validBody = {
      scenarioName: 'My scenario',
      crn: 'X123456',
      oasysAssessmentPk: '1234567',
      dateOfBirth: '1985-03-15',
      accOtherWeightedScore: '6',
      flags: ['MERGED'],
    }

    const errorsFor = async (body: Record<string, unknown>) => {
      const result = await client.post('/test/customise', { body: { ...validBody, ...body } })
      expectRenderOutcome(result)

      return (code: string) => result.getValidationErrorsByFieldCode(code).map(error => error.message)
    }

    it('should accept valid answers', async () => {
      const errors = await errorsFor({})

      for (const code of Object.keys(validBody)) {
        expect(errors(code)).toEqual([])
      }
    })

    it.each([
      ['scenarioName', '', 'Enter a scenario name'],
      ['scenarioName', '   ', 'Enter a scenario name'],
      ['crn', '', 'Enter a CRN'],
      ['crn', 'X12345', 'CRN must be 1 capital letter followed by 6 numbers, like X123456'],
      ['crn', '1234567', 'CRN must be 1 capital letter followed by 6 numbers, like X123456'],
      ['oasysAssessmentPk', '', 'Enter an OASys assessment PK'],
      ['oasysAssessmentPk', '123456', 'OASys assessment PK must be 7 numbers, like 1234567'],
      ['oasysAssessmentPk', '12345678', 'OASys assessment PK must be 7 numbers, like 1234567'],
      ['dateOfBirth', '', 'Enter a date of birth'],
      ['dateOfBirth', '15/03/1985', 'Date of birth must be a real date written as year-month-day, like 1985-03-15'],
      ['dateOfBirth', '1985-02-30', 'Date of birth must be a real date written as year-month-day, like 1985-03-15'],
      ['dateOfBirth', '2999-01-01', 'Date of birth must be in the past'],
      ['accOtherWeightedScore', '7', 'Accommodation score must be a whole number from 0 to 6'],
      ['accOtherWeightedScore', '-1', 'Accommodation score must be a whole number from 0 to 6'],
    ])('should reject %s of %p', async (code, value, message) => {
      const errors = await errorsFor({ [code]: value })

      expect(errors(code)).toEqual([message])
    })

    it('should allow a blank need score', async () => {
      const errors = await errorsFor({ accOtherWeightedScore: '' })

      expect(errors('accOtherWeightedScore')).toEqual([])
    })

    it('should reject Merged and New period of supervision ticked together', async () => {
      const errors = await errorsFor({ flags: ['MERGED', 'NEW_PERIOD_OF_SUPERVISION'] })

      expect(errors('flags')).toEqual(['Select Merged or New period of supervision, not both'])
    })

    it('should skip fields the user has set to random', async () => {
      const errors = await errorsFor({
        crn: undefined,
        crn_randomize: 'true',
        oasysAssessmentPk: undefined,
        oasysAssessmentPk_randomize: 'true',
        dateOfBirth: undefined,
        dateOfBirth_randomize: 'true',
        accOtherWeightedScore: '99',
        accOtherWeightedScore_randomize: 'true',
      })

      expect(errors('crn')).toEqual([])
      expect(errors('oasysAssessmentPk')).toEqual([])
      expect(errors('dateOfBirth')).toEqual([])
      expect(errors('accOtherWeightedScore')).toEqual([])
    })

    it('should not need a CRN when a stubbed CRN is picked', async () => {
      const errors = await errorsFor({ crn: '', stubbedCrn: 'X000001' })

      expect(errors('crn')).toEqual([])
    })
  })
})
