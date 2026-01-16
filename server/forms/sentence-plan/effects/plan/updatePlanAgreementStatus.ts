import { InternalServerError } from 'http-errors'
import {
  AgreementStatus,
  PlanAgreementAnswers,
  PlanAgreementProperties,
  SentencePlanContext,
  SentencePlanEffectsDeps,
} from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'

/**
 * Add a new plan agreement record to the PLAN_AGREEMENTS collection
 *
 * Creates or uses existing PLAN_AGREEMENTS collection and adds a new item
 * representing the agreement event. This allows tracking a full history of
 * plan agreement status changes over time.
 *
 * Maps the plan_agreement_question answer to status:
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

  // Map the form answer to the status value
  const statusMap: Record<string, AgreementStatus> = {
    yes: 'AGREED',
    no: 'DO_NOT_AGREE',
    could_not_answer: 'COULD_NOT_ANSWER',
  }

  const agreementStatus = statusMap[agreementAnswer]

  if (!agreementStatus) {
    throw new InternalServerError(`Invalid agreement answer: ${agreementAnswer}`)
  }

  // Get or create PLAN_AGREEMENTS collection
  let planAgreementsCollectionUuid = context.getData('planAgreementsCollectionUuid')

  if (!planAgreementsCollectionUuid) {
    const createResult = await deps.api.executeCommand({
      type: 'CreateCollectionCommand',
      name: 'PLAN_AGREEMENTS',
      assessmentUuid,
      user,
    })

    planAgreementsCollectionUuid = createResult.collectionUuid
  }

  // Build properties
  const properties: PlanAgreementProperties = {
    status: agreementStatus,
    status_date: new Date().toISOString(),
  }

  // Build answers
  const answers: PlanAgreementAnswers = {
    agreement_question: agreementAnswer,
  }

  // Add conditional details if present
  const detailsNo = context.getAnswer('plan_agreement_details_no') as string | undefined
  if (detailsNo) {
    answers.details_no = detailsNo
  }

  const detailsCouldNotAnswer = context.getAnswer('plan_agreement_details_could_not_answer') as string | undefined
  if (detailsCouldNotAnswer) {
    answers.details_could_not_answer = detailsCouldNotAnswer
  }

  // Add notes if present
  const notes = context.getAnswer('plan_agreement_notes') as string | undefined
  if (notes) {
    answers.notes = notes
  }

  // Add the agreement record to the collection
  await deps.api.executeCommand({
    type: 'AddCollectionItemCommand',
    collectionUuid: planAgreementsCollectionUuid,
    properties: wrapAll(properties),
    answers: wrapAll(answers),
    timeline: {
      type: 'PLAN_AGREEMENT_STATUS_CHANGED',
      data: { status: agreementStatus },
    },
    assessmentUuid,
    user,
  })
}
