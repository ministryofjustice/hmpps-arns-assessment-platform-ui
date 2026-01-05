import { InternalServerError } from 'http-errors'
import { SentencePlanEffectsDeps } from './index'
import { SentencePlanContext } from './types'
import { wrapAll } from '../../../../data/aap-api/wrappers'

/**
 * Update the plan agreement status and save all agreement form answers
 *
 * Maps the plan_agreement_question answer to AGREEMENT_STATUS property:
 * - 'yes' → 'AGREED'
 * - 'no' → 'DO_NOT_AGREE'
 * - 'could_not_answer' → 'COULD_NOT_ANSWER'
 *
 * Form fields saved:
 * - plan_agreement_question: The agreement radio selection
 * - plan_agreement_details_no: Details when "No" is selected
 * - plan_agreement_details_could_not_answer: Details when "Could not answer" is selected
 * - plan_agreement_notes: Optional notes
 */
export const updatePlanAgreementStatus = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const assessmentUuid = context.getData('assessmentUuid')
  const agreementAnswer = context.getAnswer('plan_agreement_question') as string

  if (!user) {
    throw new InternalServerError('User is required to update plan agreement status')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to update plan agreement status')
  }

  if (!agreementAnswer) {
    throw new InternalServerError('Agreement answer is required to update plan agreement status')
  }

  // Map the form answer to the AGREEMENT_STATUS value
  const statusMap: Record<string, string> = {
    yes: 'AGREED',
    no: 'DO_NOT_AGREE',
    could_not_answer: 'COULD_NOT_ANSWER',
  }

  const agreementStatus = statusMap[agreementAnswer]

  if (!agreementStatus) {
    throw new InternalServerError(`Invalid agreement answer: ${agreementAnswer}`)
  }

  // Collect all answers to save
  const answers: Record<string, any> = {
    plan_agreement_question: agreementAnswer,
  }

  // Add conditional details if present
  const detailsNo = context.getAnswer('plan_agreement_details_no')
  if (detailsNo) {
    answers.plan_agreement_details_no = detailsNo
  }

  const detailsCouldNotAnswer = context.getAnswer('plan_agreement_details_could_not_answer')
  if (detailsCouldNotAnswer) {
    answers.plan_agreement_details_could_not_answer = detailsCouldNotAnswer
  }

  // Add notes if present
  const notes = context.getAnswer('plan_agreement_notes')
  if (notes) {
    answers.plan_agreement_notes = notes
  }

  // Execute both commands together
  await deps.api.executeCommands(
    // Update AGREEMENT_STATUS property
    {
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid,
      added: {
        AGREEMENT_STATUS: { type: 'Single', value: agreementStatus },
      },
      removed: [],
      user,
    },
    // Save all form answers
    {
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid,
      added: wrapAll(answers),
      removed: [],
      user,
    },
  )
}
