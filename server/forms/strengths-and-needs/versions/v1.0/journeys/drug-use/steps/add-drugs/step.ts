import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { baseSanRoute } from '../../../../constants/path'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { saveButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'

export const addDrugsStep = step({
  path: `/${Step.add_drugs.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.drug_use.path]),
    },
  },
  cleardownFieldCodes: ['^trip_*$'],
  blocks: [drugUseSection.questions.selectMisusedDrugs.displayModes.field, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: { groups: ['default', 'drugs'] },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
        ],
        next: [redirect({ goto: Step.drug_details.path })],
      },
    }),
  ],
})
