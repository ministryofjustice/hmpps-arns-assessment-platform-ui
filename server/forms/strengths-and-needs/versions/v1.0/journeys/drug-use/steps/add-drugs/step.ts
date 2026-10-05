import {
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { baseSanRoute } from '../../../../constants/path'
import { IsUserSubmitted, Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { saveButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'
import { autosaveSubmit } from '../../../../autosave'

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
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.add_drugs)],
  validWhen: [
    validation({
      condition: Data(Step.add_drugs.code).match(Condition.Equals(IsUserSubmitted.true)),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.add_drugs.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: { groups: ['default', 'drugs'] },
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.add_drugs.code, IsUserSubmitted.true)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.add_drugs),
        ],
        next: [redirect({ goto: Step.drug_details.path })],
      },
    }),
  ],
})
