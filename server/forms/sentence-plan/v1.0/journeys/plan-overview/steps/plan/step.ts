import { loadTransition, step } from '@form-engine/form/builders'
import { blankPlanOverviewContent, pageHeading } from './fields'
import { SentencePlanV1Effects } from '../../../../effects'

export const planStep = step({
  onLoad: [
    loadTransition({
      effects: [SentencePlanV1Effects.loadOrCreatePlan()],
    }),
  ],
  path: '/overview',
  title: 'Plan Overview',
  isEntryPoint: true,
  blocks: [pageHeading, blankPlanOverviewContent],
})
