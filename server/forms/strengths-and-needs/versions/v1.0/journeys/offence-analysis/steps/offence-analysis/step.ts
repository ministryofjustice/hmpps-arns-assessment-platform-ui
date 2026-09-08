import {
  access,
  and,
  Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { saveButton } from '../../../../constants/buttons'
import { victimsCollection } from '../../constants/collections'

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
  ],
  onSubmission: [
    submit({
      when: and(
        Answer(Question.offence_analysis_who_was_the_victim).match(Condition.Array.Contains(Option.one_or_more_person)),
        Post('action').match(Condition.Equals('save')),
      ),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
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
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
          StrengthsAndNeedsEffects.emptyCollection(victimsCollection),
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
