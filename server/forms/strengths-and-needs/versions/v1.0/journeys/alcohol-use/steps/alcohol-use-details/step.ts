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
    alcoholUseSection.questions.frequency.displayModes.field,
    alcoholUseSection.questions.units.displayModes.field,
    alcoholUseSection.questions.bingeDrinking.displayModes.field,
    alcoholUseSection.questions.evidenceOfExcessDrinking.displayModes.field,
    alcoholUseSection.questions.pastIssues.displayModes.field,
    alcoholUseSection.questions.reasonsForUse.displayModes.field,
    alcoholUseSection.questions.impactOfUse.displayModes.field,
    alcoholUseSection.questions.stoppedOrReduced.displayModes.field,
    alcoholUseSection.questions.changes.displayModes.field,
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
