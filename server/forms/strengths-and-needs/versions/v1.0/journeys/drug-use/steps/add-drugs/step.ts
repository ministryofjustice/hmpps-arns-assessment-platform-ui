import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { selectMisusedDrugs } from './fields'
import { Step } from '../../constants/step'
import { sectionPath } from '../../../../constants/path'
import { Section, SectionStatus } from '../../../../constants/section'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const addDrugsStep = step({
  path: `/${Step.add_drugs.path}`,
  title: 'Add drugs',
  view: {
    locals: {
      backlink: sectionPath(Section.drug_use),
    },
  },
  blocks: [selectMisusedDrugs, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use.statusKey, SectionStatus.incomplete),
        ],
        next: [redirect({ goto: Step.drug_details.path })],
      },
    }),
  ],
})
