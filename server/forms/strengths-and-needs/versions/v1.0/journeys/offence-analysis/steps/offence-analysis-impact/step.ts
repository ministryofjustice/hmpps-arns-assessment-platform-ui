import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { markAsCompleteButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { autosaveSubmit } from '../../../../autosave'
import { auditPageView } from '../../../../audit'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const offenceAnalysisImpactStep = step({
  path: `/${Step.offence_analysis_impact.path}`,
  title: 'Offence analysis impact',
  view: {
    locals: {
      backlink: createRoute([
        ...baseSanRoute,
        Section.offence_analysis.path,
        Step.offence_analysis_involved_parties.path,
      ]),
    },
  },
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
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_impact)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis_impact.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.offence_analysis_impact.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_impact.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.yes),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
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
