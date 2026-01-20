import { accessTransition, Data, journey, redirect } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planStep } from './steps/plan/step'
import { agreePlanStep } from './steps/agree-plan/step'
import { updateAgreePlanStep } from './steps/update-agree-plan/step'
import { planHistoryStep } from './steps/plan-history/step'
import { reorderGoalStep } from './steps/reorder-goal/step'

export const planOverviewJourney = journey({
  code: 'plan-overview',
  title: 'Plan Overview',
  path: '/plan',
  onAccess: [
    accessTransition({
      next: [
        redirect({
          when: Data('session.privacyAccepted').not.match(Condition.Equals(true)),
          goto: '/forms/sentence-plan/privacy',
        }),
      ],
    }),
  ],
  steps: [planStep, agreePlanStep, updateAgreePlanStep, planHistoryStep, reorderGoalStep],
})
