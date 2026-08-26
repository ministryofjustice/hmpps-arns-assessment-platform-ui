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
import { collectionCode, collectionName } from '../../constants/constants'
import { saveButton } from '../../../../constants/buttons'

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
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(collectionCode, collectionName)],
    }),
  ],
  onSubmission: [
    submit({
      when: and(
        Answer(Question.offence_analysis_commited_against).match(Condition.Array.Contains(Option.one_or_more_people)),
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
          StrengthsAndNeedsEffects.emptyCollection(collectionName),
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
