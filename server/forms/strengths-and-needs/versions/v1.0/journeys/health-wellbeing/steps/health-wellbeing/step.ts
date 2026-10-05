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
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { IsUserSubmitted, Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'

export const healthWellbeingStep = step({
  path: `/${Step.health_wellbeing.path}`,
  title: sectionPageTitle(Section.health_and_wellbeing),
  reachability: { entryWhen: true },
  blocks: [
    healthWellbeingSection.questions.healthConditions.displayModes.field,
    healthWellbeingSection.questions.mentalHealthProblems.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.health_and_wellbeing, Step.health_wellbeing)],
  validWhen: [
    validation({
      condition: Data(Step.health_wellbeing.code).match(Condition.Equals(IsUserSubmitted.true)),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.health_wellbeing.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.health_and_wellbeing, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.health_and_wellbeing, Step.health_wellbeing),
        ],
        next: [
          redirect({
            goto: Step.physical_mental_health.path,
          }),
        ],
      },
    }),
  ],
})
