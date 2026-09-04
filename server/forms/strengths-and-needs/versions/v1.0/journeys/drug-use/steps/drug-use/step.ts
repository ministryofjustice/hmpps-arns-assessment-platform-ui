import { step, submit, redirect, Post, Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'
import { saveButton } from '../../../../constants/buttons'

export const drugUseStep = step({
  path: `/${Step.drug_use.path}`,
  title: sectionPageTitle(Section.drug_use),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [drugUseSection.questions.drugUse.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.drug_use)],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use),
        ],
        next: [
          redirect({
            when: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
            goto: Step.add_drugs.path,
          }),
          redirect({
            when: Answer(Question.drug_use).match(Condition.Equals(CommonOption.no)),
            goto: Step.drug_use_summary.path,
          }),
        ],
      },
    }),
  ],
})
