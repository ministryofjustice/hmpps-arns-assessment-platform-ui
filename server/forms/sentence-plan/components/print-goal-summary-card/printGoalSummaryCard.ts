import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import {
  BasicBlockProps,
  BlockDefinition,
  EvaluatedBlock,
  ResolvableArray,
  ResolvableString,
} from '@ministryofjustice/hmpps-forge/core/components'
import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'

interface PrintGoalStep {
  actor: ResolvableString
  description: ResolvableString
  status: ResolvableString
}

export interface PrintGoalSummaryCardProps extends BasicBlockProps {
  goalTitle: ResolvableString
  goalStatus: ResolvableString
  targetDate?: ResolvableString
  statusDate?: ResolvableString
  areaOfNeed: ResolvableString
  relatedAreasOfNeed?: ResolvableArray<string>
  steps?: ResolvableArray<PrintGoalStep>
}

export interface PrintGoalSummaryCardDefinition extends BlockDefinition, PrintGoalSummaryCardProps {
  variant: 'printGoalSummaryCard'
}

function buildParams(block: EvaluatedBlock<PrintGoalSummaryCardDefinition>) {
  const steps = (block.steps ?? []) as PrintGoalStep[]
  const relatedAreasOfNeed = (block.relatedAreasOfNeed ?? []) as string[]

  return {
    goalTitle: block.goalTitle,
    goalStatus: block.goalStatus,
    targetDate: block.targetDate,
    statusDate: block.statusDate,
    areaOfNeed: block.areaOfNeed,
    relatedAreasText: relatedAreasOfNeed.length ? [...relatedAreasOfNeed].sort().join('; ') : undefined,
    steps,
    completedCount: steps.filter(step => step.status === 'COMPLETED').length,
  }
}

export const printGoalSummaryCard = buildNunjucksComponent<PrintGoalSummaryCardDefinition>(
  'printGoalSummaryCard',
  (block: EvaluatedBlock<PrintGoalSummaryCardDefinition>, nunjucksEnv: nunjucks.Environment): string =>
    nunjucksEnv.render('sentence-plan/components/print-goal-summary-card/template.njk', {
      params: buildParams(block),
    }),
)

export function PrintGoalSummaryCard(props: PrintGoalSummaryCardProps): PrintGoalSummaryCardDefinition {
  return blockBuilder<PrintGoalSummaryCardDefinition>({ ...props, variant: 'printGoalSummaryCard' })
}
