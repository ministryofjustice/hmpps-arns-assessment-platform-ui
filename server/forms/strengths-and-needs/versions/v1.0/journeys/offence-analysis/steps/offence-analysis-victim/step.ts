import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { victimAge, victimEthnicity, victimSex, victimType } from './fields'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

const collectionName = 'victims'
const collectionCode = 'OFFENCE_ANALYSIS_VICTIM'

const VICTIM_FIELD_CODES = [
  Question.offence_analysis_victim_type,
  Question.offence_analysis_victim_age,
  Question.offence_analysis_victim_sex,
  Question.offence_analysis_victim_ethnicity,
]

export const offenceAnalysisVictimStep = step({
  path: `/${Step.offence_analysis_victim.path}`,
  title: 'Add victim',
  reachability: { entryWhen: true },
  blocks: [victimType, victimAge, victimSex, victimEthnicity, saveButton],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection('victims', 'OFFENCE_ANALYSIS_VICTIM')],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.addItemToCollection(collectionName, collectionCode, VICTIM_FIELD_CODES)],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
