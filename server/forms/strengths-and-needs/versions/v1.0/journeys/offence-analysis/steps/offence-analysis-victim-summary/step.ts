import {
  access,
  Answer,
  Condition,
  Data,
  or,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { victimCards } from './fields'
import { Step } from '../../constants/step'
import { SanAuditEvent, StrengthsAndNeedsEffects } from '../../../../../../effects'
import { victimsCollection } from '../../constants/collections'
import { contentFor } from '../../locales'
import { saveButton } from '../../../../constants/buttons'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Section } from '../../../../constants/section'
import { autosaveSubmit } from '../../../../autosave'
import { auditPageView } from '../../../../audit'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

const addAnotherButton = GovUKButton({
  text: 'Add another victim',
  name: 'action',
  value: 'add_another',
  classes: 'govuk-button--secondary',
})

export const offenceAnalysisVictimSummaryStep = step({
  path: `/${Step.offence_analysis_victim_summary.path}`,
  title: 'Victims summary',
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.offence_analysis.path]),
    },
  },
  blocks: [victimCards, saveButton, addAnotherButton],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection)],
    }),
    auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.offence_analysis, Step.offence_analysis_victim_summary),
  ],
  validWhen: [
    validation({
      condition: or(
        Data(victimsCollection.name).match(Condition.IsRequired()),
        Answer(Question.offence_analysis_who_was_the_victim).not.match(
          Condition.Array.Contains(Option.one_or_more_person),
        ),
      ),
      message: contentFor('validation.add_one_or_more_victims'),
    }),
    validation({
      condition: isUserSubmittedCondition(Step.offence_analysis_victim_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.offence_analysis_victim_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_victim_summary.code)],
      },
      onValid: {
        next: [redirect({ goto: Step.offence_analysis_involved_parties.path })],
      },
    }),
    submit({
      when: Post('action').match(Condition.Equals('add_another')),
      validate: true,
      onValid: {
        next: [redirect({ goto: Step.offence_analysis_victim.path })],
      },
    }),
    submit({
      when: Post('delete').match(Condition.IsRequired()),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.removeItemFromCollection(victimsCollection, Post('delete')),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.offence_analysis_summary.code, IsUserSubmitted.false),
        ],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
