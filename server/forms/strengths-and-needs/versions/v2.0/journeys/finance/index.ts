import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { financeIncomeStep } from './steps/finance-income/step'
import { overReliantOnFamilyOrFriendsStep } from './steps/finance-community-finance-income-friends-family/step'
import { financeConcernsStep } from './steps/finance-concerns/step'
import { financeMoneyManagementStep } from './steps/finance-money-management/step'
import { financeDebtStep } from './steps/finance-debt/step'
import { financeChangesStep } from './steps/finance-changes/step'
import { financeSummaryStep } from './steps/finance-summary/step'
import { financeAnalysisStep } from './steps/finance-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Finance Journey
 *
 * Flow:
 * Page 1: finance-income
 *   ├── (family_or_friends selected) → Page 2: community-finance-income-friends-family
 *   └── (other) ──────────────────────────────────────────────────────────────────────┐
 *                                                                                     ▼
 * Page 3: finance-concerns
 *   ├── (No)  → finance-summary (end of journey — AC 6)
 *   └── (Yes) → Page 4: finance-money-management and finance-debt
 *                  ├── (Yes debt) → Page 5: debt type → Page 6: finance-changes
 *                  └── (No/Unknown) ────────────────→ Page 6: finance-changes
 *                     → finance-summary
 */
export const financeJourney = journey({
  code: Section.finance.code,
  path: Section.finance.path,
  title: sectionPageTitle(Section.finance),
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [redirectToAnalysisIfReadOnly(Section.finance.path, Step.finance_analysis.path)],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.finance),
      sectionStatusTag: sectionStatusTag(Section.finance),
    },
  },
  steps: [
    financeIncomeStep,
    overReliantOnFamilyOrFriendsStep,
    financeConcernsStep,
    financeMoneyManagementStep,
    financeDebtStep,
    financeChangesStep,
    financeSummaryStep,
    financeAnalysisStep,
  ],
})
