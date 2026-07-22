import { Answer, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUse } from './fields'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'
import { Section, SectionStatus } from '../../../../constants/section'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugUseStep = step({
  path: `/${Step.drug_use.path}`,
  title: 'Drug use',
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass: 'govuk-body-l',
    },
  },
  blocks: [drugUse, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            when: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
            goto: Step.add_drugs.path,
          }),
          redirect({
            when: Answer(Question.drug_use).match(Condition.Equals(CommonOption.no)),
            goto: Step.drug_use_summary.path,
          }),
        ],
      },
    }),
  ],
})
