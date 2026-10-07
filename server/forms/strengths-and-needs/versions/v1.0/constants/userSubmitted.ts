import { Condition, Data } from '@ministryofjustice/hmpps-forge/core/authoring'

export enum IsUserSubmitted {
  true = 'TRUE',
  false = 'FALSE',
}

export const isUserSubmittedCode = (stepCode: string) => `is_user_submitted_${stepCode}`

export const isUserSubmittedCondition = (stepCode: string) =>
  Data(isUserSubmittedCode(stepCode)).match(Condition.Equals(IsUserSubmitted.true))
