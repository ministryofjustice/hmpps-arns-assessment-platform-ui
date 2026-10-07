import {
  access,
  and,
  Answer,
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'
import { autosaveSubmit } from '../../../../autosave'
import { auditPageView } from '../../../../audit'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const offenceAnalysisStep = step({
  path: `/${Step.offence_analysis.path}`,
  title: 'Offence analysis',
  reachability: { entryWhen: true },
  blocks: [
    offenceAnalysisSection.questions.indexOffenceDescription.displayModes.field,
    offenceAnalysisSection.questions.offenceElements.displayModes.field,
    offenceAnalysisSection.questions.whyOffenceHappened.displayModes.field,
    offenceAnalysisSection.questions.motivations.displayModes.field,
    offenceAnalysisSection.questions.offenceCommitedAgainst.displayModes.field,
    saveButton,
  ],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection)],
    }),
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.offence_analysis.code),
    submit({
      when: and(
        Answer(Question.offence_analysis_who_was_the_victim).match(Condition.Array.Contains(Option.one_or_more_person)),
        Data(victimsCollection.name).match(Condition.IsRequired()),
        Post('action').match(Condition.Equals('save')),
      ),
      validate: true,
      onAlways: {
        effects: [
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis.code),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
        ],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_victim_summary.path,
          }),
        ],
      },
    }),
    submit({
      when: and(
        Answer(Question.offence_analysis_who_was_the_victim).match(Condition.Array.Contains(Option.one_or_more_person)),
        Post('action').match(Condition.Equals('save')),
      ),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_victim.path,
          }),
        ],
      },
    }),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis.code),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_victim_summary.code),
        ],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_involved_parties.path,
          }),
        ],
      },
    }),
  ],
})
