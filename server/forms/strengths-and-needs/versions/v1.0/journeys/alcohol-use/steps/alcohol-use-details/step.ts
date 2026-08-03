import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  alcoholBingeDrinking,
  alcoholChanges,
  alcoholEvidenceOfExcessDrinking,
  alcoholFrequency,
  alcoholImpactOfUse,
  alcoholPastIssues,
  alcoholReasonsForUse,
  alcoholStoppedOrReduced,
  alcoholUnits,
} from './fields'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { contentFor } from '../../locales'

export const alcoholUseDetailsStep = step({
  path: `/${Step.alcohol_use_details.path}`,
  title: contentFor('step.alcohol_use_details'),
  view: {
    locals: {
      backlink: sectionPath(Section.alcohol_use),
    },
  },
  blocks: [
    alcoholFrequency,
    alcoholUnits,
    alcoholBingeDrinking,
    alcoholEvidenceOfExcessDrinking,
    alcoholPastIssues,
    alcoholReasonsForUse,
    alcoholImpactOfUse,
    alcoholStoppedOrReduced,
    alcoholChanges,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use.statusKey, SectionStatus.incomplete),
        ],
        next: [redirect({ goto: Step.alcohol_use_summary.path })],
      },
    }),
  ],
})
