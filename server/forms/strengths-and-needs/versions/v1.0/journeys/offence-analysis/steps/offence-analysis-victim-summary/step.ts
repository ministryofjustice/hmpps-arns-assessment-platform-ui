import {access, Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKButton} from '@ministryofjustice/hmpps-forge/govuk-components'
import {victimCards} from './fields'
import {Step} from '../../constants/step'
import {StrengthsAndNeedsEffects} from "../../../../../../effects";
import {effect} from "zod/v3";
import {loadAnswersFromCollection} from "../../../../../../effects/assessment/loadAnswersFromCollection";
import {Question} from "../../constants/question";

const addAnotherButton = GovUKButton({
  text: 'Add another victim',
  name: 'action',
  value: 'add_another',
})

const continueButton = GovUKButton({
  text: 'Continue',
  name: 'action',
  value: 'continue',
})

const VICTIM_FIELD_CODES = [
  Question.offence_analysis_victim_type,
  Question.offence_analysis_victim_age,
  Question.offence_analysis_victim_sex,
  Question.offence_analysis_victim_ethnicity,
]

export const offenceAnalysisVictimSummaryStep = step({
  path: `/${Step.offence_analysis_victim_summary.path}`,
  title: 'Victims summary',
  reachability: { entryWhen: true },
  blocks: [victimCards, addAnotherButton, continueButton],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection('victims', 'OFFENCE_ANALYSIS_VICTIM')],
    })
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('add_another')),
      validate: true,
      onValid: {
        next: [redirect({ goto: Step.offence_analysis_victim.path })],
      },
    }),
  ],
})
