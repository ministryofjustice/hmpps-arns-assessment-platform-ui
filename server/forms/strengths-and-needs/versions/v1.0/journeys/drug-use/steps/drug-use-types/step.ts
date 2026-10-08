import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { baseSanRoute } from '../../../../constants/path'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { saveButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const drugUseTypesStep = step({
  path: `/${Step.drug_use_types.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.drug_use.path]),
    },
  },
  cleardownFieldCodes: ['^trip_*$'],
  blocks: [drugUseSection.questions.selectMisusedDrugs.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.drug_use_types)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.drug_use_types.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.drug_use_types.code, Section.drug_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: { groups: ['default', 'drugs'] },
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_types.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use_types),
        ],
        next: [redirect({ goto: Step.drug_use_details.path })],
      },
    }),
  ],
})
