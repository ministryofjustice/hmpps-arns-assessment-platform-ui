import { Answer, Condition, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKHeading, GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { stepTitle, StepDefinition } from '../../locales'
import {
  Answerable,
  questionsOf,
  CheckYourAnswersSection,
  staticCheckYourAnswersSections,
  dynamicCheckYourAnswersSections,
} from './sections'
import { answerRow, questionsWithin } from '../../../../constants/questionContent'

const sectionHeader = (step: StepDefinition, visibleWhen?: ReturnType<typeof anyAnswered>) =>
  TemplateWrapper({
    template: '<div>{{slot:heading}}</div>',
    slots: {
      heading: [
        GovUKHeading({
          text: stepTitle(step),
          size: 'm',
          level: 2,
        }),
      ],
    },
    visibleWhen,
  })

const anyAnswered = (fields: Answerable[]) =>
  or(
    fields
      .flatMap(field => questionsWithin(field.content))
      .map(question => Answer(question.code).match(Condition.IsRequired())),
  )

const answersFor = (fields: Answerable[]) =>
  GovUKSummaryList({
    visibleWhen: anyAnswered(fields),
    rows: fields.map(field => ({
      ...(field.displayModes?.summaryRow ?? answerRow(field.content)),
      visibleWhen: anyAnswered([field]),
    })),
  })

const blocksFor = (entry: CheckYourAnswersSection): BlockDefinition[] => {
  const questions = questionsOf(entry)

  if (questions.length === 0) {
    return [sectionHeader(entry.step)]
  }

  return [sectionHeader(entry.step, anyAnswered(questions)), answersFor(questions)] as BlockDefinition[]
}

export const staticFactorsHeader = GovUKHeading({
  text: 'Static factors',
  size: 'l',
  level: 1,
})

export const dynamicFactorsHeader = GovUKHeading({
  text: 'Dynamic factors',
  size: 'l',
  level: 1,
  visibleWhen: anyAnswered(dynamicCheckYourAnswersSections.flatMap(questionsOf)),
})

export const staticCheckYourAnswersBlock: BlockDefinition[] = [
  TemplateWrapper({
    template: '<div class="govuk-!-margin-bottom-9">{{slot:sections}}</div>',
    slots: { sections: staticCheckYourAnswersSections.flatMap(blocksFor) },
  }),
]

export const dynamicCheckYourAnswersBlock: BlockDefinition[] = [
  TemplateWrapper({
    template: '<div class="govuk-!-margin-bottom-9">{{slot:sections}}</div>',
    slots: { sections: dynamicCheckYourAnswersSections.flatMap(blocksFor) },
  }),
]
