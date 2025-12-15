import { journey } from '@form-engine/form/builders'
import { planStep } from './steps/plan/step'
import { agreePlanStep } from './steps/agree-plan/step'
import { updateAgreePlanStep } from './steps/update-agree-plan/step'
import { planHistoryStep } from './steps/plan-history/step'

export const planOverviewJourney = journey({
  code: 'plan-overview',
  title: 'Plan Overview',
  path: '/plan',
  steps: [planStep, agreePlanStep, updateAgreePlanStep, planHistoryStep],
})
