import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { sectionDivider, usedInLastSixMonthsSection, usedMoreThanSixMonthsSection } from './fields'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { saveButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'

export const drugDetailsStep = step({
  path: `/${Step.drug_details.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.drug_use.path, Step.add_drugs.path]),
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
    drugUseSection.questions.drugsInjected.displayModes.field,
    drugUseSection.questions.receivingTreatment.displayModes.field,
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
        next: [
          redirect({
            goto: Step.drug_use_history.path,
          }),
        ],
      },
    }),
  ],
})
