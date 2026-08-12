import { AccessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
import { AssessmentInfoDetails } from './assessment-info-details/assessmentInfoDetails'
import { ButtonAsLink } from './button-as-link/buttonAsLink'
import {
  GoalSummaryCardAgreed,
  GoalSummaryCardDraft,
  GoalSummaryCardHistory,
} from './goal-summary-card/goalSummaryCard'
import { PreviousVersions } from './previous-versions/previousVersions'
import { PrintGoalSummaryCard } from './print-goal-summary-card/printGoalSummaryCard'
import { WrappingSelect } from './wrapping-select/wrappingSelect'

export { AccessibleAutocomplete } from './accessible-autocomplete/accessibleAutocomplete'
export { AssessmentInfoDetails } from './assessment-info-details/assessmentInfoDetails'
export { ButtonAsLink } from './button-as-link/buttonAsLink'
export {
  GoalSummaryCardAgreed,
  GoalSummaryCardDraft,
  GoalSummaryCardHistory,
} from './goal-summary-card/goalSummaryCard'
export { WrappingSelect } from './wrapping-select/wrappingSelect'
export { PrintGoalSummaryCard } from './print-goal-summary-card/printGoalSummaryCard'

export const sentencePlanComponents = [
  AccessibleAutocomplete,
  AssessmentInfoDetails,
  ButtonAsLink,
  GoalSummaryCardDraft,
  GoalSummaryCardAgreed,
  GoalSummaryCardHistory,
  PrintGoalSummaryCard,
  PreviousVersions,
  WrappingSelect,
]
