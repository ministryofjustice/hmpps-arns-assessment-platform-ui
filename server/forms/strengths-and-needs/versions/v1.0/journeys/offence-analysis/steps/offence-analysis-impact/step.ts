import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  offenceAnalysisAcceptResponsibility,
  offenceAnalysisEscalation,
  offenceAnalysisLeader,
  offenceAnalysisPerpetratorOfDomesticAbuse,
  offenceAnalysisRisk,
  offenceAnalysisVictimOfDomesticAbuse,
  offenceImpactOnVictims,
  patternsOfOffending,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { markAsCompleteButton } from '../../../../constants/buttons'

export const offenceAnalysisImpactStep = step({
  path: `/${Step.offence_analysis_impact.path}`,
  title: 'Offence analysis impact',
  reachability: { entryWhen: true },
  blocks: [
    offenceAnalysisLeader,
    offenceImpactOnVictims,
    offenceAnalysisAcceptResponsibility,
    offenceAnalysisEscalation,
    offenceAnalysisPerpetratorOfDomesticAbuse,
    offenceAnalysisVictimOfDomesticAbuse,
    patternsOfOffending,
    offenceAnalysisRisk,
    markAsCompleteButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_summary.path,
          }),
        ],
      },
    }),
  ],
})
