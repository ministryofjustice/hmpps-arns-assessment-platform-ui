import { unwrapAll } from '../../../../data/aap-api/wrappers'
import {
  AgreementStatus,
  DerivedPlanAgreement,
  PlanAgreementAnswers,
  PlanAgreementProperties,
  RawCollection,
  SentencePlanContext,
} from '../types'

interface PlanAgreementsData {
  planAgreements: DerivedPlanAgreement[]
  planAgreementsCollectionUuid: string | undefined
  latestAgreementStatus: AgreementStatus
  latestAgreementDate: Date | undefined
}

interface AssessmentData {
  collections?: RawCollection[]
}

/**
 * Derive plan agreements from the loaded assessment
 *
 * Extracts the PLAN_AGREEMENTS collection from the assessment, unwraps the
 * answers and properties, and sorts by status_date (newest first).
 *
 * Sets:
 * - Data('planAgreements'): Array of derived plan agreements (sorted newest first)
 * - Data('latestAgreementStatus'): Status of the most recent agreement (or 'DRAFT' if none)
 * - Data('latestAgreementDate'): Status date of the most recent agreement (or undefined if none)
 * - Data('planAgreementsCollectionUuid'): UUID of the PLAN_AGREEMENTS collection (for adding new agreements)
 */
export const derivePlanAgreementsFromAssessment = () => async (context: SentencePlanContext) => {
  const planAgreementsData = derivePlanAgreementsData(context.getData('assessment') as AssessmentData | undefined)

  context.setData('planAgreements', planAgreementsData.planAgreements)
  context.setData('planAgreementsCollectionUuid', planAgreementsData.planAgreementsCollectionUuid)
  context.setData('latestAgreementStatus', planAgreementsData.latestAgreementStatus)
  context.setData('latestAgreementDate', planAgreementsData.latestAgreementDate)
}

export const derivePlanAgreementsData = (assessment: AssessmentData): PlanAgreementsData => {
  const noPlanAgreements: PlanAgreementsData = {
    planAgreements: [],
    planAgreementsCollectionUuid: undefined,
    latestAgreementStatus: 'DRAFT',
    latestAgreementDate: undefined,
  }

  if (!assessment?.collections) {
    return noPlanAgreements
  }

  const planAgreementsCollection = assessment.collections.find(c => c.name === 'PLAN_AGREEMENTS')

  if (!planAgreementsCollection) {
    return noPlanAgreements
  }

  const agreements: DerivedPlanAgreement[] = planAgreementsCollection.items.map(item => {
    const answers = unwrapAll<PlanAgreementAnswers>(item.answers)
    const properties = unwrapAll<PlanAgreementProperties>(item.properties)

    return {
      uuid: item.uuid,
      status: properties.status,
      statusDate: new Date(properties.status_date),
      agreementQuestion: answers.agreement_question,
      detailsNo: answers.details_no,
      detailsCouldNotAnswer: answers.details_could_not_answer,
      notes: answers.notes,
      createdBy: answers.created_by,
    }
  })

  // Sort by status date, newest first
  agreements.sort((a, b) => b.statusDate.getTime() - a.statusDate.getTime())

  return {
    planAgreements: agreements,
    planAgreementsCollectionUuid: planAgreementsCollection.uuid,
    latestAgreementStatus: agreements[0]?.status ?? 'DRAFT',
    latestAgreementDate: agreements[0]?.statusDate,
  }
}
