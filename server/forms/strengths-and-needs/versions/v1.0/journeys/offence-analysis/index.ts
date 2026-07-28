import {Condition, Data, journey, Query} from '@ministryofjustice/hmpps-forge/core/authoring'
import {offenceAnalysisStep} from './steps/offence-analysis/step'
import {offenceAnalysisVictimStep} from './steps/offence-analysis-victim/step'
import {offenceAnalysisVictimSummaryStep} from './steps/offence-analysis-victim-summary/step'
import {Section} from '../../constants/section'
import {commonContentFor} from '../../locales'
import {offenceAnalysisEditVictimStep} from "./steps/offence-analysis-edit-victim/step";

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
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.offence-analysis'),
      sectionStatus: Data(Section.offence_analysis.statusKey),
    },
  },
  steps: [
    offenceAnalysisStep,
    offenceAnalysisVictimStep,
    offenceAnalysisVictimSummaryStep,
    offenceAnalysisEditVictimStep
  ],
})
