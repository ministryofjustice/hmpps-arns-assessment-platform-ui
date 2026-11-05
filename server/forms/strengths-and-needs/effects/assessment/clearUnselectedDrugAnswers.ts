import { InternalServerError } from 'http-errors'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { drugsList } from '../../versions/v1.0/journeys/drug-use/constants'
import { Question } from '../../versions/v1.0/journeys/drug-use/constants/question'
import { SanAuditEvent } from '../../auditEvents'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { queueCommand } from './pendingCommands'

// The answers asked about each drug, on the drug details and history pages.
const perDrugQuestions = [
  Question.drug_last_used_value,
  Question.how_often_used_value,
  Question.how_often_used_details,
  Question.drugs_injected_value,
]

const drugValues = new Set(drugsList.map(drug => drug.value))

/**
 * This man manually removes answers from drugs that are no longer selected
 * (Because Forge only clears answers on the page being saved,
 * and these are on later pages).
 *
 * This can all be removed once a fix is in Forge for clearing down only the specific
 * answers which are unreachable.
 */
export const clearUnselectedDrugAnswers =
  (_deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const selectedDrugs = (context.getAnswer(Question.select_misused_drugs) as string[] | undefined) ?? []
    const unselectedDrugs = drugsList.map(drug => drug.value).filter(drug => !selectedDrugs.includes(drug))

    const removed = unselectedDrugs
      .flatMap(drug => perDrugQuestions.map(code => code.replace('%1', drug.toLowerCase())))
      .filter(code => context.getAnswer(code) !== undefined)

    const added: Record<string, unknown> = {}
    const injected = context.getAnswer(Question.drugs_injected) as string[] | undefined
    // Answers that aren't drugs, such as "None", stay.
    const stillInjected = injected?.filter(value => !drugValues.has(value) || selectedDrugs.includes(value))

    if (injected && stillInjected.length !== injected.length) {
      if (stillInjected.length) {
        added[Question.drugs_injected] = stillInjected
      } else {
        removed.push(Question.drugs_injected)
      }
    }

    if (!removed.length && !Object.keys(added).length) {
      return
    }

    for (const code of removed) {
      context.clearAnswer(code)
    }

    queueCommand(context, {
      command: {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user,
        added: wrapAll(added),
        removed,
      },
      mapToOasys: true,
      audit: { action: SanAuditEvent.EDIT_ANSWERS, details: { changedFields: [...removed, ...Object.keys(added)] } },
    })
  }
