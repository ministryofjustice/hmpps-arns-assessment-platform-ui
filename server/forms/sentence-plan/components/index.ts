import { accessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
import { goalSummaryCardAgreed, goalSummaryCardDraft } from './goal-summary-card/goalSummaryCard'

export type { AccessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
export { GoalSummaryCardAgreed, GoalSummaryCardDraft } from './goal-summary-card/goalSummaryCard'

export const sentencePlanComponents = [accessibleAutocomplete, goalSummaryCardDraft, goalSummaryCardAgreed]
