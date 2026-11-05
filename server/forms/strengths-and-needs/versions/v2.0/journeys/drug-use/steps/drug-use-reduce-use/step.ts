import {
  Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
  when
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
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

export const drugUseReduceUseStep = step({
  path: `/${Step.drug_use_reduce_use.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: when(anyInjectedDrugUsedInLastSixMonths)
        .then(createRoute([...baseSanRoute, Section.drug_use.path, Step.drug_use_last_injected.path]))
        .else(createRoute([...baseSanRoute, Section.drug_use.path, Step.drug_use_details.path])),
    },
  },
  blocks: [
    drugUseSection.questions.anythingHelpedStopOrReduce.displayModes.field,
    drugUseSection.questions.motivatedToStopOrReduce.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.drug_use_reduce_use)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.drug_use_reduce_use.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.drug_use_reduce_use.code, Section.drug_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_reduce_use.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use_reduce_use),
        ],
        next: [redirect({ goto: Step.drug_use_change_use.path })],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use_reduce_use),
        ],
      },
    }),
  ],
})
