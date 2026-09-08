import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import {
  BlockDefinition,
  ResolvableArray,
  ResolvableString,
  ResolvedPropsOf,
} from '@ministryofjustice/hmpps-forge/core/components'

interface PrintGoalStep {
  actor: ResolvableString
  description: ResolvableString
  status: ResolvableString
}

export interface PrintGoalSummaryCard extends BlockDefinition {
  goalTitle: ResolvableString
  goalStatus: ResolvableString
  targetDate?: ResolvableString
  statusDate?: ResolvableString
  areaOfNeed: ResolvableString
  relatedAreasOfNeed?: ResolvableArray<string>
  steps?: ResolvableArray<PrintGoalStep>
}

function buildParams(props: ResolvedPropsOf<PrintGoalSummaryCard>) {
  const steps = (props.steps ?? []) as PrintGoalStep[]
  const relatedAreasOfNeed = (props.relatedAreasOfNeed ?? []) as string[]

  return {
    goalTitle: props.goalTitle,
    goalStatus: props.goalStatus,
    targetDate: props.targetDate,
    statusDate: props.statusDate,
    areaOfNeed: props.areaOfNeed,
    relatedAreasText: relatedAreasOfNeed.length ? [...relatedAreasOfNeed].sort().join('; ') : undefined,
    steps,
    completedCount: steps.filter(step => step.status === 'COMPLETED').length,
  }
}

export const PrintGoalSummaryCard = nunjucksComponent<PrintGoalSummaryCard>('printGoalSummaryCard', {
  render: (props, nunjucksEnv) =>
    nunjucksEnv.render('sentence-plan/components/print-goal-summary-card/template.njk', {
      params: buildParams(props),
    }),
})
