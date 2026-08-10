import { Answer, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { alcoholUseSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { Section, SectionStatus } from '../../../../constants/section'
import { CommonOption } from '../../../../constants/commonOption'
import { sectionPageTitle } from '../../../../locales'

export const alcoholUseStep = step({
  path: `/${Step.alcohol_use.path}`,
  title: sectionPageTitle(Section.alcohol_use),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass: 'govuk-body-l',
    },
  },
  blocks: [alcoholUseSection.fields.alcoholUse.displayModes.field, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            when: Answer(Question.alcohol_use).match(Condition.Equals(CommonOption.no)),
            goto: Step.alcohol_use_summary.path,
          }),
          redirect({
            when: Answer(Question.alcohol_use).not.match(Condition.Equals(CommonOption.no)),
            goto: Step.alcohol_use_details.path,
          }),
        ],
      },
    }),
  ],
})
