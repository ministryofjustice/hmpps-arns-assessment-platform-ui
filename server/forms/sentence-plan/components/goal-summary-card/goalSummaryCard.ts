import type nunjucks from 'nunjucks'
import { buildNunjucksComponent } from '@form-engine-express-nunjucks/utils/buildNunjucksComponent'
import {
  BlockDefinition,
  ConditionalArray,
  ConditionalNumber,
  ConditionalString,
  EvaluatedBlock,
} from '@form-engine/form/types/structures.type'
import { block as blockBuilder } from '@form-engine/form/builders'

/**
 * A step within a goal.
 */
export interface GoalStep {
  actor: ConditionalString
  description: ConditionalString
  status: ConditionalString
}

/**
 * Action link displayed in the card header.
 */
export interface GoalAction {
  text: ConditionalString
  href: ConditionalString
  visuallyHiddenText?: ConditionalString
  classes?: ConditionalString
}

/**
 * Button displayed at the bottom of the card.
 */
export interface GoalButton {
  text: ConditionalString
  href: ConditionalString
  classes?: ConditionalString
}

/**
 * Note attached to a goal (used for removed goals).
 */
export interface GoalNote {
  type: ConditionalString
  note: ConditionalString
}

/**
 * Base props for Goal Summary Card components.
 *
 * These components display a summary card for sentence plan goals. Two variants
 * are available based on plan status:
 * - `GoalSummaryCardAgreed` - Shows step counter and collapsible details (for AGREED plans)
 * - `GoalSummaryCardDraft` - Shows steps directly without collapsible wrapper (for DRAFT plans)
 *
 * @example
 * ```typescript
 * GoalSummaryCardAgreed({
 *   goalTitle: 'I will find accommodation that is more suitable for me',
 *   goalStatus: 'ACTIVE',
 *   targetDate: '4 June 2026',
 *   areaOfNeed: 'Accommodation',
 *   steps: [
 *     { actor: 'Jaylen', description: 'Do something', status: 'NOT_STARTED' },
 *     { actor: 'Jaylen', description: 'Do another thing', status: 'COMPLETED' },
 *   ],
 *   actions: [
 *     { text: 'Change goal', href: '/goal/123/edit' },
 *     { text: 'Add or change steps', href: '/goal/123/add-steps' },
 *   ],
 * })
 * ```
 */
export interface GoalSummaryCardProps {
  /** The goal title displayed in the card header */
  goalTitle: ConditionalString

  /** Goal status - affects how dates and information are displayed */
  goalStatus: ConditionalString

  /** Goal UUID for generating links */
  goalUuid?: ConditionalString

  /** Target date for the goal (formatted string) */
  targetDate?: ConditionalString

  /** Date the goal status changed (for achieved/removed goals) */
  statusDate?: ConditionalString

  /** Main area of need for the goal */
  areaOfNeed: ConditionalString

  /** Related areas of need (displayed as semicolon-separated list) */
  relatedAreasOfNeed?: ConditionalArray<string>

  /** Steps associated with this goal */
  steps?: ConditionalArray<GoalStep>

  /** Notes attached to the goal (e.g., removal reason) */
  notes?: ConditionalArray<GoalNote>

  /** Action links shown in the card header */
  actions?: ConditionalArray<GoalAction>

  /** Buttons shown at the bottom of the card */
  buttons?: ConditionalArray<GoalButton>

  /** Error message to display at the top of the card */
  errorMessage?: ConditionalString

  /** Index for generating unique IDs */
  index?: ConditionalNumber

  /** Additional CSS classes */
  classes?: ConditionalString
}

/**
 * Goal Summary Card (Agreed) component interface.
 *
 * Displays a summary card for an agreed sentence plan goal. Shows a step
 * counter and the steps table inside a collapsible details element.
 *
 * Use this variant when the plan has been agreed (status is AGREED).
 */
export interface GoalSummaryCardAgreed extends BlockDefinition, GoalSummaryCardProps {
  variant: 'goalSummaryCardAgreed'
}

/**
 * Goal Summary Card (Draft) component interface.
 *
 * Displays a summary card for a draft sentence plan goal. Shows the steps
 * table directly without a collapsible wrapper or step counter.
 *
 * Use this variant when the plan is in DRAFT status.
 */
export interface GoalSummaryCardDraft extends BlockDefinition, GoalSummaryCardProps {
  variant: 'goalSummaryCardDraft'
}

type GoalSummaryCardBlock = GoalSummaryCardAgreed | GoalSummaryCardDraft

/**
 * Builds the template parameters for goal summary card rendering.
 */
function buildParams(block: EvaluatedBlock<GoalSummaryCardBlock>) {
  const steps = (block.steps ?? []) as GoalStep[]
  const notes = (block.notes ?? []) as GoalNote[]
  const actions = (block.actions ?? []) as GoalAction[]
  const buttons = (block.buttons ?? []) as GoalButton[]
  const relatedAreasOfNeed = (block.relatedAreasOfNeed ?? []) as string[]

  const completedCount = steps.filter(step => step.status === 'COMPLETED').length

  // Find the first REMOVED note if goal was removed
  let removedNote: string | undefined

  if (block.goalStatus === 'REMOVED' && notes.length > 0) {
    const removedNoteObj = notes.find(note => note.type === 'REMOVED')
    removedNote = removedNoteObj?.note as string | undefined
  }

  // Build related areas text
  const relatedAreasText =
    relatedAreasOfNeed.length > 0
      ? [...relatedAreasOfNeed]
          .sort()
          .join('; ')
          .toLowerCase()
      : undefined

  return {
    goalTitle: block.goalTitle,
    goalStatus: block.goalStatus,
    goalUuid: block.goalUuid,
    targetDate: block.targetDate,
    statusDate: block.statusDate,
    areaOfNeed: block.areaOfNeed?.toLowerCase(),
    relatedAreasText,
    steps,
    stepsCount: steps.length,
    completedCount,
    notes,
    removedNote,
    actions,
    buttons,
    errorMessage: block.errorMessage,
    index: block.index,
    classes: block.classes,
  }
}

/**
 * Creates a renderer function for the goal summary card variants.
 */
function createRenderer(templatePath: string) {
  return async (block: EvaluatedBlock<GoalSummaryCardBlock>, nunjucksEnv: nunjucks.Environment): Promise<string> => {
    const params = buildParams(block)
    return nunjucksEnv.render(templatePath, { params })
  }
}

/**
 * Goal Summary Card (Agreed) component.
 * Shows step counter and collapsible details for agreed plans.
 */
export const goalSummaryCardAgreed = buildNunjucksComponent<GoalSummaryCardAgreed>(
  'goalSummaryCardAgreed',
  createRenderer('sentence-plan/components/goal-summary-card/agreed.njk'),
)

/**
 * Goal Summary Card (Draft) component.
 * Shows steps directly without collapsible wrapper for draft plans.
 */
export const goalSummaryCardDraft = buildNunjucksComponent<GoalSummaryCardDraft>(
  'goalSummaryCardDraft',
  createRenderer('sentence-plan/components/goal-summary-card/draft.njk'),
)

/**
 * Creates a Goal Summary Card for agreed plans.
 *
 * Shows step counter and collapsible details element containing the steps table.
 * Use this variant when the plan status is AGREED.
 *
 * @example
 * ```typescript
 * GoalSummaryCardAgreed({
 *   goalTitle: 'I will find accommodation that is more suitable for me',
 *   goalStatus: 'ACTIVE',
 *   targetDate: '4 June 2026',
 *   areaOfNeed: 'Accommodation',
 *   steps: [
 *     { actor: 'Tom', description: 'Build the form-engine', status: 'IN_PROGRESS' },
 *   ],
 *   actions: [
 *     { text: 'Change goal', href: '/goal/123/edit' },
 *   ],
 * })
 * ```
 */
export function GoalSummaryCardAgreed(props: GoalSummaryCardProps): GoalSummaryCardAgreed {
  return blockBuilder<GoalSummaryCardAgreed>({ ...props, variant: 'goalSummaryCardAgreed' })
}

/**
 * Creates a Goal Summary Card for draft plans.
 *
 * Shows steps table directly without a collapsible wrapper or step counter.
 * Use this variant when the plan status is DRAFT.
 *
 * @example
 * ```typescript
 * GoalSummaryCardDraft({
 *   goalTitle: 'I will find accommodation that is more suitable for me',
 *   goalStatus: 'ACTIVE',
 *   targetDate: '4 June 2026',
 *   areaOfNeed: 'Accommodation',
 *   steps: [
 *     { actor: 'Tom', description: 'Build the form-engine', status: 'IN_PROGRESS' },
 *   ],
 *   actions: [
 *     { text: 'Change goal', href: '/goal/123/edit' },
 *   ],
 * })
 * ```
 */
export function GoalSummaryCardDraft(props: GoalSummaryCardProps): GoalSummaryCardDraft {
  return blockBuilder<GoalSummaryCardDraft>({ ...props, variant: 'goalSummaryCardDraft' })
}
