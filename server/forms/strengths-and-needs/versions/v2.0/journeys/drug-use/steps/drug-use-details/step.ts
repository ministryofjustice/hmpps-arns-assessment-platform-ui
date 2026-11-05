import {
  access, Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { sectionDivider, usedInLastSixMonthsSection, usedMoreThanSixMonthsSection } from './fields'
import {anyInjectedDrugUsedInLastSixMonths, drugUseSection} from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { saveButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import {Question} from "../../constants/question";
import {CommonOption} from "../../../../constants/commonOption";

export const drugUseDetailsStep = step({
  path: `/${Step.drug_use_details.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.drug_use.path, Step.drug_use_last_used.path]),
    },
  },
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.drug_use_details),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.drug_use_details.code),
      message: 'This step is not user submitted',
    }),
  ],
  blocks: [
    usedInLastSixMonthsSection,
    sectionDivider,
    usedMoreThanSixMonthsSection,
    drugUseSection.questions.drugsInjected.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    autosaveSubmit(Step.drug_use_details.code, Section.drug_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_details.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use_details),
        ],
        next: [
          redirect({
            goto: Step.drug_use_last_injected.path,
            when: anyInjectedDrugUsedInLastSixMonths,
          }),
          redirect({
            goto: Step.drug_use_reduce_use.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use_details),
        ],
      },
    }),
  ],
})
