import { accessTransition, Data, redirect, step, throwError } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanEffects } from '../../effects'

export const oasysAccessStep = step({
  path: '/oasys',
  title: 'OASys Access',
  isEntryPoint: true,
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadOrCreatePlanByOasys(), SentencePlanEffects.setSessionAccessType('oasys')],
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
