import { accessTransition, Data, redirect, step, throwError } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanEffects } from '../../effects'

export const mpopAccessStep = step({
  path: '/crn/:crn',
  title: 'MPOP Access',
  isEntryPoint: true,
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadOrCreatePlanByCrn(), SentencePlanEffects.setSessionAccessType('mpop')],
      next: [
        throwError({
          when: Data('assessmentUuid').not.match(Condition.IsRequired()),
          status: 404,
          message: 'No assessment UUID was found.',
        }),
        redirect({ goto: 'v1.0/plan/overview' }),
      ],
    }),
  ],
})
