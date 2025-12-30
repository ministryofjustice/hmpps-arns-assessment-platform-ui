import { accessTransition, Data, Format, loadTransition, next, step } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanV1Effects } from '../../effects'

export const mpopAccessStep = step({
  path: '/crn/:crn',
  title: 'MPOP Access',
  isEntryPoint: true,
  view: {
    locals: {
      showPlanHistoryTab: Data('assessment.properties.AGREEMENT_STATUS.value').match(
        Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
      ),
    },
  },

  onLoad: [
    loadTransition({
      effects: [SentencePlanV1Effects.loadOrCreatePlanByCrn(), SentencePlanV1Effects.setSessionAccessType('mpop')],
    }),
  ],
  onAccess: [
    accessTransition({
      guards: Data('assessmentUuid').match(Condition.IsRequired()),
      redirect: [next({ goto: '/sentence-plan/v1.0/plan/overview' })],
    }),
    accessTransition({
      guards: Data('assessmentUuid').not.match(Condition.IsRequired()),
      status: 404,
      message: 'No assessment UUID was found.',
    }),
  ],
})
