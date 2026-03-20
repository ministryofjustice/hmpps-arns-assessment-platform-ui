import { accessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
import { assessmentInfoDetails } from './assessment-info-details/assessmentInfoDetails'
import { buttonAsLink } from './button-as-link/buttonAsLink'
import { goalSummaryCardAgreed, goalSummaryCardDraft } from './goal-summary-card/goalSummaryCard'
import { previousVersions } from './previous-versions/previousVersions'

export { AccessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
export { AssessmentInfoDetails } from './assessment-info-details/assessmentInfoDetails'
export { ButtonAsLink } from './button-as-link/buttonAsLink'
export { GoalSummaryCardAgreed, GoalSummaryCardDraft } from './goal-summary-card/goalSummaryCard'

export const sentencePlanComponents = [
  accessibleAutocomplete,
  assessmentInfoDetails,
  buttonAsLink,
  goalSummaryCardDraft,
  goalSummaryCardAgreed,
  previousVersions,
]
