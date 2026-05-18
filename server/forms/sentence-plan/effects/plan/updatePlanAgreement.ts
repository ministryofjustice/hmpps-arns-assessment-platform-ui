import { InternalServerError } from 'http-errors'
import {
  AgreementStatus,
  PlanAgreementAnswers,
  PlanAgreementProperties,
  SentencePlanContext,
  SentencePlanEffectsDeps,
} from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { getRequiredEffectContext } from '../goals/goalUtils'

/**
 * Updates the plan agreement status by adding a new agreement record to the PLAN_AGREEMENTS collection.
 * Used when re-agreeing to a plan after changes, producing UPDATED_AGREED or UPDATED_DO_NOT_AGREE statuses.
 */

export const updatePlanAgreement = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'updatePlanAgreement')
  const session = context.getSession()
  const agreementAnswer = context.getAnswer('update_plan_agreement_question') as string

  // Use practitioner display name from session (populated from handover context),
  // falling back to user.name for HMPPS Auth users
  const practitionerName = session.practitionerDetails?.displayName || user.name

  if (!agreementAnswer) {
    throw new InternalServerError('Agreement answer is required to update plan agreement status')
  }

  // Map the form answer to the status value
  const statusMap: Record<string, AgreementStatus> = {
    yes: 'UPDATED_AGREED',
    no: 'UPDATED_DO_NOT_AGREE',
  }

  const agreementStatus = statusMap[agreementAnswer]

  if (!agreementStatus) {
    throw new InternalServerError(`Invalid agreement answer: ${agreementAnswer}`)
  }

  // Get PLAN_AGREEMENTS collection
  const planAgreementsCollectionUuid = context.getData('planAgreementsCollectionUuid')

  if (!planAgreementsCollectionUuid) {
    throw new InternalServerError('PLAN_AGREEMENTS collection not found')
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

  // Add details when the practitioner selected "no" (mandatory field, validated before this runs)
  if (agreementAnswer === 'no') {
    const detailsNo = context.getAnswer('update_plan_agreement_details_no') as string | undefined
    if (!detailsNo) {
      throw new InternalServerError('Agreement details are required when the answer is "no"')
    }
    answers.details_no = detailsNo
  }

  // Add created_by from practitioner details (same pattern as notes)
  answers.created_by = practitionerName

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
