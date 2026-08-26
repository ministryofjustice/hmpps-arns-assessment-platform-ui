import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { saveButton } from '../../../../constants/buttons'

export const drugUseHistoryStep = step({
  path: `/${Step.drug_use_history.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: sectionPath(Section.drug_use) + Step.drug_details.path,
    },
  },
  blocks: [
    drugUseSection.questions.reasonsForUse.displayModes.field,
    drugUseSection.questions.reasonsForUseDetails.displayModes.field,
    drugUseSection.questions.affectedTheirLife.displayModes.field,
    drugUseSection.questions.affectedTheirLifeDetails.displayModes.field,
    drugUseSection.questions.anythingHelpedStopOrReduce.displayModes.field,
    drugUseSection.questions.whatCouldHelpNotUseInFuture.displayModes.field,
    drugUseSection.questions.drugUseChanges.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
        ],
        next: [redirect({ goto: 'drug-use-summary' })],
      },
    }),
  ],
})
