import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  injectedDrugsField,
  receivingTreatmentField,
  sectionDivider,
  usedInLastSixMonthsSection,
  usedMoreThanSixMonthsSection,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { formVersion } from '../../../../constants/formVersion'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugDetailsStep = step({
  path: `/${Step.drug_details.path}`,
  title: 'Drug details',
  view: {
    locals: {
      backlink: `/strengths-and-needs/${formVersion}${Section.drug_use.path}/${Step.add_drugs.path}/`,
    },
  },
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
  ],
  blocks: [
    usedInLastSixMonthsSection,
    sectionDivider,
    usedMoreThanSixMonthsSection,
    injectedDrugsField,
    receivingTreatmentField,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            goto: Step.drug_use_history.path,
          }),
        ],
      },
    }),
  ],
})
