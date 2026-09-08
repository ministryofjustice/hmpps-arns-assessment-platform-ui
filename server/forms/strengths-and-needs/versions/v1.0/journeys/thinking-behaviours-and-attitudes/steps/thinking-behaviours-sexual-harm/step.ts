import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor, sectionPageTitle } from '../../../../locales'
import { sectionPath } from '../../../../constants/path'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const thinkingBehavioursSexualHarmStep = step({
  path: `/${Step.thinkingBehavioursSexualHarm.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  view: {
    locals: {
      sectionTitle: contentFor('step.thinking_behaviours_sexual_harm'),
      pageSubHeading: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      backlink: sectionPath(Section.thinking_behaviours_and_attitudes) + Step.thinkingBehavioursRiskOfSexualHarm.path,
    },
  },
  blocks: [
    thinkingBehavioursAttitudesSection.questions.sexualPreoccupation.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.offenceRelatedSexualInterest.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.emotionalIntimacy.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.thinking_behaviours_and_attitudes,
      Step.thinkingBehavioursSexualHarm,
    ),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinkingBehavioursSexualHarm,
          ),
        ],
        next: [
          redirect({
            goto: Step.thinkingBehavioursSummary.path,
          }),
        ],
      },
    }),
  ],
})
