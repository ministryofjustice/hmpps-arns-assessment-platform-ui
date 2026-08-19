import type nunjucks from 'nunjucks'
import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import {
  BasicBlockProps,
  BlockDefinition,
  ResolvableArray,
  ResolvableBoolean,
  ResolvableNumber,
  ResolvableString,
  ResolvedPropsOf,
} from '@ministryofjustice/hmpps-forge/core/components'

/**
 * A step within a goal.
 */
export interface GoalStep {
  actor: ResolvableString
  description: ResolvableString
  status: ResolvableString
}

/**
 * Action link displayed in the card header.
 */
export interface GoalAction {
  text: ResolvableString
  href: ResolvableString
  visuallyHiddenText?: ResolvableString
  classes?: ResolvableString
  hidden?: ResolvableBoolean
  dataAiId?: ResolvableString
}

/**
 * Button displayed at the bottom of the card.
 */
export interface GoalButton {
  text: ResolvableString
  href: ResolvableString
  classes?: ResolvableString
}

/**
 * Note attached to a goal (used for removed goals).
 */
export interface GoalNote {
  type: ResolvableString
  note: ResolvableString
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
export interface GoalSummaryCardProps extends BasicBlockProps {
  /** The goal title displayed in the card header */
  goalTitle: ResolvableString

  /** Goal status - affects how dates and information are displayed */
  goalStatus: ResolvableString

  /** Goal UUID for generating links */
  goalUuid?: ResolvableString

  /** Target date for the goal (formatted string) */
  targetDate?: ResolvableString

  /** Date the goal status changed (for achieved/removed goals) */
  statusDate?: ResolvableString

  /** Main area of need label for the goal */
  areaOfNeed: ResolvableString

  /** Related area of need labels (displayed as semicolon-separated list) */
  relatedAreasOfNeed?: ResolvableArray<string>

  /** Steps associated with this goal */
  steps?: ResolvableArray<GoalStep>

  /** Notes attached to the goal (e.g., removal reason) */
  notes?: ResolvableArray<GoalNote>

  /** Action links shown in the card header */
  actions?: ResolvableArray<GoalAction>

  /** Whether the page is in read-only mode */
  isReadOnly?: ResolvableBoolean

  /** Buttons shown at the bottom of the card */
  buttons?: ResolvableArray<GoalButton>

  /** Error message to display at the top of the card */
  errorMessage?: ResolvableString

  /** Index for generating unique IDs */
  index?: ResolvableNumber

  /** Additional CSS classes */
  classes?: ResolvableString

  /** Whether to show the "Move goal up" link */
  showMoveUp?: ResolvableBoolean

  /** Whether to show the "Move goal down" link */
  showMoveDown?: ResolvableBoolean

  /** URL for the "Move goal up" action */
  moveUpHref?: ResolvableString

  /** URL for the "Move goal down" action */
  moveDownHref?: ResolvableString
}

/**
 * Goal Summary Card (Agreed) component interface.
 *
 * Displays a summary card for an agreed sentence plan goal. Shows a step
 * counter and the steps table inside a collapsible details element.
 *
 * Use this variant when the plan has been agreed (status is AGREED).
 */
export interface GoalSummaryCardAgreed extends BlockDefinition, GoalSummaryCardProps {}

/**
 * Goal Summary Card (Draft) component interface.
 *
 * Displays a summary card for a draft sentence plan goal. Shows the steps
 * table directly without a collapsible wrapper or step counter.
 *
 * Use this variant when the plan is in DRAFT status.
 */
export interface GoalSummaryCardDraft extends BlockDefinition, GoalSummaryCardProps {}

/**
 * Goal Summary Card (History) component interface.
 *
 * Read-only variant used inside the Plan History accordion. Steps are shown
 * inline (no collapsible wrapper), the step counter uses "X of Y" wording,
 * and FUTURE-status goals display a "This is a future goal" line.
 */
export interface GoalSummaryCardHistory extends BlockDefinition, GoalSummaryCardProps {}

type GoalSummaryCardBlock = GoalSummaryCardAgreed | GoalSummaryCardDraft | GoalSummaryCardHistory

/**
 * Builds the template parameters for goal summary card rendering.
 */
function buildParams(props: ResolvedPropsOf<GoalSummaryCardBlock>) {
  const steps = (props.steps ?? []) as GoalStep[]
  const notes = (props.notes ?? []) as GoalNote[]
  const actions = ((props.actions ?? []) as GoalAction[]).filter(action => !action.hidden)
  const buttons = (props.buttons ?? []) as GoalButton[]
  const relatedAreasOfNeed = (props.relatedAreasOfNeed ?? []) as string[]

  const completedCount = steps.filter(step => step.status === 'COMPLETED').length

  // Find the first REMOVED note if goal was removed
  let removedNote: string | undefined

  if (props.goalStatus === 'REMOVED' && notes.length > 0) {
    const removedNoteObj = notes.find(note => note.type === 'REMOVED')
    removedNote = removedNoteObj?.note as string | undefined
  }

  const relatedAreasText = relatedAreasOfNeed.length > 0 ? [...relatedAreasOfNeed].sort().join('; ') : undefined

  return {
    goalTitle: props.goalTitle,
    goalStatus: props.goalStatus,
    goalUuid: props.goalUuid,
    targetDate: props.targetDate,
    statusDate: props.statusDate,
    areaOfNeed: props.areaOfNeed,
    relatedAreasText,
    steps,
    stepsCount: steps.length,
    completedCount,
    notes,
    removedNote,
    actions,
    isReadOnly: props.isReadOnly,
    buttons,
    errorMessage: props.errorMessage,
    index: props.index,
    classes: props.classes,
    showMoveUp: props.showMoveUp,
    showMoveDown: props.showMoveDown,
    moveUpHref: props.moveUpHref,
    moveDownHref: props.moveDownHref,
  }
}

/**
 * Creates a renderer function for the goal summary card variants.
 */
function createRenderer(templatePath: string) {
  return (props: ResolvedPropsOf<GoalSummaryCardBlock>, nunjucksEnv: nunjucks.Environment): string => {
    const params = buildParams(props)

    return nunjucksEnv.render(templatePath, { params })
  }
}

/**
 * Goal Summary Card for agreed plans.
 * Shows step counter and collapsible details element containing the steps table.
 * Use this variant when the plan status is AGREED.
 */
export const GoalSummaryCardAgreed = nunjucksComponent<GoalSummaryCardAgreed>('goalSummaryCardAgreed', {
  render: createRenderer('sentence-plan/components/goal-summary-card/agreed.njk'),
})

/**
 * Goal Summary Card for draft plans.
 * Shows steps table directly without a collapsible wrapper or step counter.
 * Use this variant when the plan status is DRAFT.
 */
export const GoalSummaryCardDraft = nunjucksComponent<GoalSummaryCardDraft>('goalSummaryCardDraft', {
  render: createRenderer('sentence-plan/components/goal-summary-card/draft.njk'),
})

/**
 * Goal Summary Card for the Plan History accordion.
 * Steps are shown inline and the counter reads "X of Y steps completed".
 * For FUTURE-status goals the card includes a "This is a future goal" line.
 */
export const GoalSummaryCardHistory = nunjucksComponent<GoalSummaryCardHistory>('goalSummaryCardHistory', {
  render: createRenderer('sentence-plan/components/goal-summary-card/history.njk'),
})
