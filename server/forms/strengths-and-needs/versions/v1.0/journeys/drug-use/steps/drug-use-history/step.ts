import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugUseHistoryStep = step({
  path: `/${Step.drug_use_history.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: sectionPath(Section.drug_use) + Step.drug_details.path,
    },
  },
  blocks: [
    drugUseSection.fields.reasonsForUse.displayModes.field,
    drugUseSection.fields.reasonsForUseDetails.displayModes.field,
    drugUseSection.fields.affectedTheirLife.displayModes.field,
    drugUseSection.fields.affectedTheirLifeDetails.displayModes.field,
    drugUseSection.fields.anythingHelpedStopOrReduce.displayModes.field,
    drugUseSection.fields.whatCouldHelpNotUseInFuture.displayModes.field,
    drugUseSection.fields.drugUseChanges.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use.statusKey, SectionComplete.no),
        ],
        next: [redirect({ goto: 'drug-use-summary' })],
      },
    }),
  ],
})
