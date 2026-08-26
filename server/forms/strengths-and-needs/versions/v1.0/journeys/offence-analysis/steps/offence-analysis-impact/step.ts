import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { markAsCompleteButton } from '../../../../constants/buttons'

export const offenceAnalysisImpactStep = step({
  path: `/${Step.offence_analysis_impact.path}`,
  title: 'Offence analysis impact',
  reachability: { entryWhen: true },
  blocks: [
    offenceAnalysisSection.questions.offenceAnalysisLeader.displayModes.field,
    offenceAnalysisSection.questions.offenceImpactOnVictims.displayModes.field,
    offenceAnalysisSection.questions.offenceAnalysisAcceptResponsibility.displayModes.field,
    offenceAnalysisSection.questions.offenceAnalysisEscalation.displayModes.field,
    offenceAnalysisSection.questions.offenceAnalysisPerpetratorOfDomesticAbuse.displayModes.field,
    offenceAnalysisSection.questions.offenceAnalysisVictimOfDomesticAbuse.displayModes.field,
    offenceAnalysisSection.questions.patternsOfOffending.displayModes.field,
    offenceAnalysisSection.questions.offenceAnalysisRisk.displayModes.field,
    markAsCompleteButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
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
