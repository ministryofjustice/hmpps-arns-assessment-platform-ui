import {
  Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { autosaveSubmit } from '../../../../autosave'
import { auditPageView } from '../../../../audit'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const offenceAnalysisInvolvedPartiesStep = step({
  path: `/${Step.offence_analysis_involved_parties.path}`,
  title: 'Offence analysis Involved Parties',
  view: {
    locals: {
      backlink: when(
        Answer(Question.offence_analysis_who_was_the_victim)
          .match(Condition.Array.Contains(Option.one_or_more_person)),
      )
        .then(createRoute([...baseSanRoute, Section.offence_analysis.path, Step.offence_analysis_victim_summary.path]))
        .else(createRoute([...baseSanRoute, Section.offence_analysis.path])),
    },
  },
  blocks: [
    offenceAnalysisSection.questions.offenceAnalysisWhoWasTheOffenceCommittedAgainst.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_involved_parties),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis_involved_parties.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.offence_analysis_involved_parties.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_involved_parties.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_impact.path,
          }),
        ],
      },
    }),
  ],
})
