import {access, Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {drugsSummaryTab} from './fields'
import {Step} from "../../constants/step";
import {Section, SectionStatus} from "../../../../constants/section";

export const drugUseSummaryStep = step({
  path: `/${Step.drug_use_summary.path}`,
  title: 'Drug use summary',
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
  ],
  blocks: [drugsSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use.statusKey, SectionStatus.complete),
        ],
        next: [redirect({ goto: Step.drug_use_analysis.path })],
      },
    }),
  ],
})
