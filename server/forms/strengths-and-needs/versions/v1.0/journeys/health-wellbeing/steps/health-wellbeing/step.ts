import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

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
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.health_and_wellbeing, SectionComplete.no),
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
