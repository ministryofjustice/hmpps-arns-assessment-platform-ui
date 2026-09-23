import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { victimsCollection } from '../../constants/collections'
import { isReadOnlyMode } from '../../../../guards'
import { SanAuditEvent, auditPageView } from '../../../../audit'

export const offenceAnalysisAnalysisStep = step({
  path: `/${Step.offence_analysis_analysis.path}`,
  title: analysisPageTitle(Section.offence_analysis),
  blocks: [offenceAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_analysis),
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection)],
    }),
  ],
})
