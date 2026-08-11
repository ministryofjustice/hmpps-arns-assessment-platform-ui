import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { alcoholUseSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'

export const alcoholUseDetailsStep = step({
  path: `/${Step.alcohol_use_details.path}`,
  title: sectionPageTitle(Section.alcohol_use),
  view: {
    locals: {
      backlink: sectionPath(Section.alcohol_use),
    },
  },
  blocks: [
    alcoholUseSection.fields.frequency.displayModes.field,
    alcoholUseSection.fields.units.displayModes.field,
    alcoholUseSection.fields.bingeDrinking.displayModes.field,
    alcoholUseSection.fields.evidenceOfExcessDrinking.displayModes.field,
    alcoholUseSection.fields.pastIssues.displayModes.field,
    alcoholUseSection.fields.reasonsForUse.displayModes.field,
    alcoholUseSection.fields.impactOfUse.displayModes.field,
    alcoholUseSection.fields.stoppedOrReduced.displayModes.field,
    alcoholUseSection.fields.changes.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use, SectionComplete.no),
        ],
        next: [redirect({ goto: Step.alcohol_use_summary.path })],
      },
    }),
  ],
})
