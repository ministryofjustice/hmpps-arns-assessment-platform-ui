import { journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { planStep } from './steps/plan/step'
import { agreePlanStep } from './steps/agree-plan/step'
import { updateAgreePlanStep } from './steps/update-agree-plan/step'
import { planHistoryStep } from './steps/plan-history/step'
import { previousVersionsStep } from './steps/previous-versions/step'
import { viewHistoricStep } from './steps/view-historic/step'
import { printPreviewStep } from './steps/print-preview/step'

export const planOverviewJourney = journey({
  code: 'plan-overview',
  title: 'Plan Overview',
  path: '/plan',
  steps: [
    planStep,
    printPreviewStep,
    agreePlanStep,
    updateAgreePlanStep,
    planHistoryStep,
    previousVersionsStep,
    viewHistoricStep,
  ],
})
