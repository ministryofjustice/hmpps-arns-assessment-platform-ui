import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { detailsFactory } from './detailsFactory'

describe('detailsFactory', () => {
  const baseOptions = {
    code: 'test_details',
    label: 'Give details',
    dependentWhen: Answer('parent_question').match(Condition.Equals('SOME_VALUE')),
  }

  it('should create a character count field with max length of 2000', () => {
    const result = detailsFactory(baseOptions)

    expect(result.variant).toBe('govukCharacterCount')
    expect(result.code).toBe('test_details')
    expect(result.label).toBe('Give details')
    expect(result.maxLength).toBe(2000)
    expect(result).not.toHaveProperty('hint')
  })

  it('should pass through hint when provided', () => {
    const result = detailsFactory({ ...baseOptions, hint: 'Consider patterns and quality.' })

    expect(result.hint).toBe('Consider patterns and quality.')
  })

  it('should add required validation when requiredMessage is provided', () => {
    const result = detailsFactory({ ...baseOptions, requiredMessage: 'Enter details' })

    expect(result.validWhen).toBeDefined()
    expect(result.validWhen).toHaveLength(2)
    expect(result.validWhen).toEqual(expect.arrayContaining([expect.objectContaining({ message: 'Enter details' })]))
  })

  it('should only have max length validation when requiredMessage is omitted', () => {
    const result = detailsFactory(baseOptions)

    expect(result.validWhen).toBeDefined()
    expect(result.validWhen).toHaveLength(1)
  })
})
