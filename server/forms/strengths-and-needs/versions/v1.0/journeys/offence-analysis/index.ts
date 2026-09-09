import { Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { offenceAnalysisStep } from './steps/offence-analysis/step'
import { offenceAnalysisVictimStep } from './steps/offence-analysis-victim/step'
import { offenceAnalysisVictimSummaryStep } from './steps/offence-analysis-victim-summary/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { offenceAnalysisEditVictimStep } from './steps/offence-analysis-edit-victim/step'
import { offenceAnalysisInvolvedPartiesStep } from './steps/offence-analysis-involved-parties/step'
import { offenceAnalysisImpactStep } from './steps/offence-analysis-impact/step'
import { offenceAnalysisSummaryStep } from './steps/offence_analysis_summary/step'
import { redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Offence Analysis Journey
 *
 * Flow:
 * offence-analysis → (ONE_OR_MORE_PEOPLE)
 *   ├─→ offence-analysis-victim (create)
 *       ├─→ offence-analysis-victim-details (summary)
 *           ├─→ (add_another) → offence-analysis-victim (create) [loop]
 *           └─→ (continue) → offence-analysis-analysis
 * offence-analysis → (NOT ONE_OR_MORE_PEOPLE)
 *   └─→ offence-analysis-summary → offence-analysis-analysis
 */
export const offenceAnalysisJourney = journey({
  code: Section.offence_analysis.code,
  title: 'Offence analysis',
  path: Section.offence_analysis.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  onAccess: [redirectToAnalysisIfReadOnly(Section.offence_analysis.path, Step.offence_analysis_summary.path)],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.offence_analysis),
      sectionStatusTag: sectionStatusTag(Section.offence_analysis),
    },
  },
  steps: [
    offenceAnalysisStep,
    offenceAnalysisVictimStep,
    offenceAnalysisVictimSummaryStep,
    offenceAnalysisEditVictimStep,
    offenceAnalysisInvolvedPartiesStep,
    offenceAnalysisImpactStep,
    offenceAnalysisSummaryStep,
  ],
})
