import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { sectionDivider, usedInLastSixMonthsSection, usedMoreThanSixMonthsSection } from './fields'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'
import { saveButton } from '../../../../constants/buttons'

export const drugDetailsStep = step({
  path: `/${Step.drug_details.path}`,
  title: sectionPageTitle(Section.drug_use),
  view: {
    locals: {
      backlink: sectionPath(Section.drug_use) + Step.add_drugs.path,
    },
  },
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.drug_details),
  ],
  blocks: [
    usedInLastSixMonthsSection,
    sectionDivider,
    usedMoreThanSixMonthsSection,
    drugUseSection.questions.drugsInjected.displayModes.field,
    drugUseSection.questions.receivingTreatment.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_details),
        ],
        next: [
          redirect({
            goto: Step.drug_use_history.path,
          }),
        ],
      },
    }),
  ],
})
