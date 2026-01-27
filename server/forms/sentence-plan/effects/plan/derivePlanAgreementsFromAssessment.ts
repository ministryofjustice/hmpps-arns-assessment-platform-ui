import { unwrapAll } from '../../../../data/aap-api/wrappers'
import {
  DerivedPlanAgreement,
  PlanAgreementAnswers,
  PlanAgreementProperties,
  RawCollection,
  SentencePlanContext,
} from '../types'

/**
 * Derive plan agreements from the loaded assessment
 *
 * Extracts the PLAN_AGREEMENTS collection from the assessment, unwraps the
 * answers and properties, and sorts by status_date (newest first).
 *
 * Sets:
 * - Data('planAgreements'): Array of derived plan agreements (sorted newest first)
 * - Data('latestAgreementStatus'): Status of the most recent agreement (or undefined if none)
 * - Data('latestAgreementDate'): Status date of the most recent agreement (or undefined if none)
 * - Data('planAgreementsCollectionUuid'): UUID of the PLAN_AGREEMENTS collection (for adding new agreements)
 */
export const derivePlanAgreementsFromAssessment = () => async (context: SentencePlanContext) => {
  const assessment = context.getData('assessment') as { collections?: RawCollection[] } | undefined

  if (!assessment?.collections) {
    context.setData('planAgreements', [])
    context.setData('latestAgreementStatus', 'DRAFT')
    context.setData('latestAgreementDate', undefined)
    return
  }

  const planAgreementsCollection = assessment.collections.find(c => c.name === 'PLAN_AGREEMENTS')

  if (!planAgreementsCollection) {
    context.setData('planAgreements', [])
    context.setData('latestAgreementStatus', 'DRAFT')
    context.setData('latestAgreementDate', undefined)
    return
  }

  context.setData('planAgreementsCollectionUuid', planAgreementsCollection.uuid)

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

  context.setData('planAgreements', agreements)

  // Set the latest agreement status and date for easy access
  context.setData('latestAgreementStatus', agreements[0]?.status ?? 'DRAFT')
  context.setData('latestAgreementDate', agreements[0]?.statusDate)
}
