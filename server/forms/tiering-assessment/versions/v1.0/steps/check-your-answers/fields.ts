import { Answer, Condition, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKHeading, GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { commonContentFor, sectionPageTitle, StepDefinition } from '../../locales'
import { Answerable, questionsOf, checkYourAnswersSections, CheckYourAnswersSection } from './sections'
import { answerRow, questionsWithin } from '../../../../constants/questionContent'

const sectionHeader = (step: StepDefinition) =>
  TemplateWrapper({
    template:
      '<div class="govuk-grid-row govuk-!-margin-top-8">' +
      '<div class="govuk-grid-column-three-quarters">{{slot:heading}}</div>' +
      '</div>',
    slots: {
      heading: [
        GovUKHeading({
          text: sectionPageTitle(step),
          size: 'l',
          level: 2,
          classes: 'govuk-!-margin-bottom-0',
        }),
      ],
    },
  })

const anyAnswered = (fields: Answerable[]) =>
  or(
    fields
      .flatMap(field => questionsWithin(field.content))
      .map(question => Answer(question.code).match(Condition.IsRequired())),
  )

const groupHeading = (text: ReturnType<typeof commonContentFor>, fields: Answerable[]) =>
  GovUKHeading({ text, size: 'm', level: 3, visibleWhen: anyAnswered(fields) })

const answersFor = (fields: Answerable[]) =>
  GovUKSummaryList({ rows: fields.map(field => field.displayModes?.answerRow ?? answerRow(field.content)) })

const blocksFor = (entry: CheckYourAnswersSection): BlockDefinition[] => {
  const questions = questionsOf(entry)

  if (questions.length === 0) {
    return [sectionHeader(entry.step)]
  }

  return [
    sectionHeader(entry.step),
    groupHeading(commonContentFor('summary'), questions),
    answersFor(questions),
  ] as BlockDefinition[]
}

export const checkYourAnswersBlock: BlockDefinition[] = [
  TemplateWrapper({
    template: '<div class="govuk-!-margin-bottom-9">{{slot:sections}}</div>',
    slots: { sections: checkYourAnswersSections.flatMap(blocksFor) },
  }),
]
