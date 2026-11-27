import {
  and,
  Condition,
  Data,
  not,
  or,
  Post,
  PredicateExpr,
  Self,
  validation,
  ValidationExpr,
} from '@ministryofjustice/hmpps-forge/core/authoring'

/** Same pattern the training stubs use: 1 letter followed by 6 digits, like X123456 */
export const CRN_PATTERN = '^[A-Z]\\d{6}$'

export const OASYS_ASSESSMENT_PK_PATTERN = '^\\d{7}$'

/**
 * Builds a pattern that matches a whole number from 0 to max, with no leading zeros or decimals.
 */
export function scoreRangePattern(max: number): string {
  if (!Number.isInteger(max) || max < 0) {
    throw new Error(`Need score maximum must be a whole number of 0 or more, got ${max}`)
  }

  const allowed = Array.from({ length: max + 1 }, (_, score) => String(score))

  return `^(?:${allowed.join('|')})$`
}

/**
 * The Customise tab that holds a field. The launcher template prefixes the error summary link with it,
 * so the user knows which tab to open.
 */
type CustomiseTab = 'Subject details' | 'Criminogenic needs' | 'Scenario flags' | 'Practitioner details'

const inTab = (tab: CustomiseTab) => ({ tab })

const isRandomised = (fieldKey: string): PredicateExpr => Post(`${fieldKey}_randomize`).match(Condition.Equals('true'))

const isBlank = (): PredicateExpr => Self().not.match(Condition.IsRequired())

const isFilledIn = (): PredicateExpr => Self().match(Condition.IsRequired())

const matches = (pattern: string): PredicateExpr => Self().match(Condition.String.MatchesRegex(pattern))

const isRealDate = (): PredicateExpr => Self().match(Condition.Date.IsValid())

const usesStubbedCrn = (): PredicateExpr => Post('stubbedCrn').match(Condition.IsRequired())

/**
 * Whether a RandomizableField shows as randomised. After a failed submission the user's own choice,
 * posted in the hidden `<fieldKey>_randomize` input, wins over the scenario's saved setting.
 */
export const randomisedState = (fieldKey: string): PredicateExpr =>
  or(
    isRandomised(fieldKey),
    and(
      Post(`${fieldKey}_randomize`).not.match(Condition.IsRequired()),
      Data(`${fieldKey}_isRandomized`).match(Condition.Equals(true)),
    ),
  )

export const scenarioNameValidation = (): ValidationExpr[] => [
  validation({
    condition: isFilledIn(),
    message: 'Enter a scenario name',
  }),
]

export const crnValidation = (): ValidationExpr[] => [
  validation({
    condition: or(isRandomised('crn'), usesStubbedCrn(), isFilledIn()),
    message: 'Enter a CRN',
    details: inTab('Subject details'),
  }),
  validation({
    condition: or(isRandomised('crn'), usesStubbedCrn(), isBlank(), matches(CRN_PATTERN)),
    message: 'CRN must be 1 capital letter followed by 6 numbers, like X123456',
    details: inTab('Subject details'),
  }),
]

export const oasysAssessmentPkValidation = (): ValidationExpr[] => [
  validation({
    condition: or(isRandomised('oasysAssessmentPk'), isFilledIn()),
    message: 'Enter an OASys assessment PK',
    details: inTab('Subject details'),
  }),
  validation({
    condition: or(isRandomised('oasysAssessmentPk'), isBlank(), matches(OASYS_ASSESSMENT_PK_PATTERN)),
    message: 'OASys assessment PK must be 7 numbers, like 1234567',
    details: inTab('Subject details'),
  }),
]

export const dateOfBirthValidation = (): ValidationExpr[] => [
  validation({
    condition: or(isRandomised('dateOfBirth'), isFilledIn()),
    message: 'Enter a date of birth',
    details: inTab('Subject details'),
  }),
  validation({
    condition: or(isRandomised('dateOfBirth'), isBlank(), isRealDate()),
    message: 'Date of birth must be a real date written as year-month-day, like 1985-03-15',
    details: inTab('Subject details'),
  }),
  validation({
    condition: or(isRandomised('dateOfBirth'), isBlank(), not(isRealDate()), Self().match(Condition.Date.IsPastDate())),
    message: 'Date of birth must be in the past',
    details: inTab('Subject details'),
  }),
]

/**
 * A blank score is allowed, as scenarios leave some scores unset on purpose.
 */
export const needScoreValidation = (fieldKey: string, needTitle: string, maxScore: number): ValidationExpr[] => [
  validation({
    condition: or(isRandomised(fieldKey), isBlank(), matches(scoreRangePattern(maxScore))),
    message: `${needTitle} score must be a whole number from 0 to ${maxScore}`,
    details: inTab('Criminogenic needs'),
  }),
]

export const flagsValidation = (): ValidationExpr[] => [
  validation({
    condition: not(
      and(
        Self().match(Condition.Array.Contains('MERGED')),
        Self().match(Condition.Array.Contains('NEW_PERIOD_OF_SUPERVISION')),
      ),
    ),
    message: 'Select Merged or New period of supervision, not both',
    details: inTab('Scenario flags'),
  }),
]
