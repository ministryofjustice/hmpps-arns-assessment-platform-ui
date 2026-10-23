import {
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
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.offence_analysis.code, Section.offence_analysis),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis.code),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_impact.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
        ],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.emptyCollection(victimsCollection),
        ],
        next: [
          redirect({
            when: and(
              Answer(Question.offence_analysis_who_was_the_victim).match(
                Condition.Array.Contains(Option.one_or_more_person),
              ),
              Data(victimsCollection.name).match(Condition.IsRequired()),
            ),
            goto: Step.offence_analysis_victim_summary.path,
          }),
          redirect({
            when: Answer(Question.offence_analysis_who_was_the_victim).match(
              Condition.Array.Contains(Option.one_or_more_person),
            ),
            goto: Step.offence_analysis_victim.path,
          }),
          redirect({
            goto: Step.offence_analysis_involved_parties.path,
          }),
        ],
      },
      onInvalid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers(false)],
      },
    }),
  ],
})
