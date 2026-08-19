import {
  access,
  Answer,
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { victimCards } from './fields'
import { Step } from '../../constants/step'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'
import { collectionCode, collectionName } from '../../constants/constants'
import { contentFor } from '../../locales'

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

export const offenceAnalysisVictimSummaryStep = step({
  path: `/${Step.offence_analysis_victim_summary.path}`,
  title: 'Victims summary',
  reachability: { entryWhen: true },
  blocks: [victimCards, addAnotherButton, continueButton],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(collectionCode, collectionName)],
    }),
  ],
  validWhen: [
    validation({
      condition: Data('victims').match(Condition.IsRequired()),
      message: contentFor('validation.add_one_or_more_victims'),
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('continue')),
      validate: true,
      onValid: {
        next: [
          redirect({
            when: Answer(Question.offence_analysis_commited_against).match(
              Condition.Array.Contains(CommonOption.other),
            ),
            goto: Step.offence_analysis_involved_parties.path,
          }),
          redirect({ goto: Step.offence_analysis_impact.path }),
        ],
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
        effects: [StrengthsAndNeedsEffects.removeItemFromCollection(collectionName, Post('delete'))],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
