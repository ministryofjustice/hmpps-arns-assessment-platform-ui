import { accessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
import { assessmentInfoDetails } from './assessment-info-details/assessmentInfoDetails'
import { buttonAsLink } from './button-as-link/buttonAsLink'
import {
  goalSummaryCardAgreed,
  goalSummaryCardDraft,
  goalSummaryCardHistory,
} from './goal-summary-card/goalSummaryCard'
import { previousVersions } from './previous-versions/previousVersions'
import { wrappingSelect } from './wrapping-select/wrappingSelect'

export { AccessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
export { AssessmentInfoDetails } from './assessment-info-details/assessmentInfoDetails'
export { ButtonAsLink } from './button-as-link/buttonAsLink'
export {
  GoalSummaryCardAgreed,
  GoalSummaryCardDraft,
  GoalSummaryCardHistory,
} from './goal-summary-card/goalSummaryCard'
export { WrappingSelect } from './wrapping-select/wrappingSelect'

export const sentencePlanComponents = [
  accessibleAutocomplete,
  assessmentInfoDetails,
  buttonAsLink,
  goalSummaryCardDraft,
  goalSummaryCardAgreed,
  goalSummaryCardHistory,
  previousVersions,
  wrappingSelect,
]
