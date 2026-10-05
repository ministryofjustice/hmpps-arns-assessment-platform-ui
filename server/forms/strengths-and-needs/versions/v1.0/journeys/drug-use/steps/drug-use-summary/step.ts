import {
  access,
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { summaryTab } from './fields'
import { Step } from '../../constants/step'
import { IsUserSubmitted, Section, SectionComplete } from '../../../../constants/section'
import { summaryPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'

export const drugUseSummaryStep = step({
  path: `/${Step.drug_use_summary.path}`,
  title: summaryPageTitle(Section.drug_use),
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.drug_use, Step.drug_use_summary),
  ],
  validWhen: [
    validation({
      condition: Data(Step.drug_use_summary.code).match(Condition.Equals(IsUserSubmitted.true)),
      message: 'This step is not user submitted',
    }),
  ],
  blocks: [summaryTab],
  onSubmission: [
    autosaveSubmit(Step.drug_use_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.true)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.drug_use, Step.drug_use_summary),
        ],
        next: [redirect({ goto: `${Step.drug_use_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
