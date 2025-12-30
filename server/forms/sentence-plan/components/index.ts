import { accessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
import { buttonAsLink } from './button-as-link/buttonAsLink'
import { goalSummaryCardAgreed, goalSummaryCardDraft } from './goal-summary-card/goalSummaryCard'

export type { AccessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
export { ButtonAsLink } from './button-as-link/buttonAsLink'
export { GoalSummaryCardAgreed, GoalSummaryCardDraft } from './goal-summary-card/goalSummaryCard'

export const sentencePlanComponents = [
  accessibleAutocomplete,
  buttonAsLink,
  goalSummaryCardDraft,
  goalSummaryCardAgreed,
]
