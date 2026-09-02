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
import { victimsCollection } from '../../constants/collections'
import { contentFor } from '../../locales'
import { saveButton } from '../../../../constants/buttons'

const addAnotherButton = GovUKButton({
  text: 'Add another victim',
  name: 'action',
  value: 'add_another',
  classes: 'govuk-button--secondary',
})

export const offenceAnalysisVictimSummaryStep = step({
  path: `/${Step.offence_analysis_victim_summary.path}`,
  title: 'Victims summary',
  reachability: { entryWhen: true },
  blocks: [victimCards, saveButton, addAnotherButton],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(victimsCollection)],
    }),
  ],
  validWhen: [
    validation({
      condition: Data(victimsCollection.name).match(Condition.IsRequired()),
      message: contentFor('validation.add_one_or_more_victims'),
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        next: [
          redirect({
            when: Answer(Question.offence_analysis_who_was_the_victim).match(
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
        effects: [StrengthsAndNeedsEffects.removeItemFromCollection(victimsCollection, Post('delete'))],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
