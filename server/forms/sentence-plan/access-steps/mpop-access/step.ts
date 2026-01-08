import { accessTransition, Data, loadTransition, next, step } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanEffects } from '../../effects'

export const mpopAccessStep = step({
  path: '/crn/:crn',
  title: 'MPOP Access',
  isEntryPoint: true,
  onLoad: [
    loadTransition({
      effects: [SentencePlanEffects.loadOrCreatePlanByCrn(), SentencePlanEffects.setSessionAccessType('mpop')],
    }),
  ],
  onAccess: [
    accessTransition({
      guards: Data('assessmentUuid').match(Condition.IsRequired()),
      redirect: [next({ goto: 'v1.0/plan/overview' })],
    }),
    accessTransition({
      guards: Data('assessmentUuid').not.match(Condition.IsRequired()),
      status: 404,
      message: 'No assessment UUID was found.',
    }),
  ],
})
