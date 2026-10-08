import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const healthWellbeingStep = step({
  path: `/${Step.health_wellbeing_status.path}`,
  title: sectionPageTitle(Section.health_and_wellbeing),
  reachability: { entryWhen: true },
  blocks: [
    healthWellbeingSection.questions.healthConditions.displayModes.field,
    healthWellbeingSection.questions.mentalHealthProblems.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.health_and_wellbeing, Step.health_wellbeing_status)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.health_wellbeing_status.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.health_wellbeing_status.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_status.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.health_and_wellbeing, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.health_and_wellbeing, Step.health_wellbeing_status),
        ],
        next: [
          redirect({
            goto: Step.health_wellbeing_details.path,
          }),
        ],
      },
    }),
  ],
})
