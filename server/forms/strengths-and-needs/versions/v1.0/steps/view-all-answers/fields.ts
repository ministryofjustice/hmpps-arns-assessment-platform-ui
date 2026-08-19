import { Answer, Condition, Data, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKHeading, GovUKSummaryList, GovUKTag } from '@ministryofjustice/hmpps-forge/govuk-components'
import { answerRow, questionsWithin } from '../../constants/questionContent'
import { Section, SectionComplete } from '../../constants/section'
import { commonContentFor } from '../../locales'
import { analysisOf, Answerable, questionsOf, viewAllAnswersSections, ViewAllAnswersSection } from './sections'

type SectionDefinition = (typeof Section)[keyof typeof Section]

const sectionHeader = (section: SectionDefinition) =>
  TemplateWrapper({
    template:
      '<div class="govuk-grid-row govuk-!-margin-top-8">' +
      '<div class="govuk-grid-column-three-quarters">{{slot:heading}}</div>' +
      '<div class="govuk-grid-column-one-quarter govuk-!-text-align-right">{{slot:status}}</div>' +
      '</div>',
    slots: {
      heading: [
        GovUKHeading({
          text: commonContentFor(`sectionTitle.${section.code}`),
          size: 'l',
          level: 2,
          classes: 'govuk-!-margin-bottom-0',
        }),
      ],
      status: [
        GovUKTag({
          text: commonContentFor('status.complete'),
          visibleWhen: Data(section.statusKey).match(Condition.Equals(SectionComplete.yes)),
        }),
        GovUKTag({
          text: commonContentFor('status.incomplete'),
          classes: 'govuk-tag--grey',
          visibleWhen: Data(section.statusKey).not.match(Condition.Equals(SectionComplete.yes)),
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

const blocksFor = (entry: ViewAllAnswersSection): BlockDefinition[] => {
  const questions = questionsOf(entry)
  const analysis = analysisOf(entry)

  if (questions.length === 0 && analysis.length === 0) {
    return [sectionHeader(entry.section)]
  }

  return [
    sectionHeader(entry.section),
    groupHeading(commonContentFor('summary'), questions),
    answersFor(questions),
    groupHeading(commonContentFor('practitioner_analysis'), analysis),
    answersFor(analysis),
  ] as BlockDefinition[]
}

export const viewAllAnswersBlocks: BlockDefinition[] = [
  TemplateWrapper({
    template: '<div class="govuk-!-margin-bottom-9">{{slot:sections}}</div>',
    slots: { sections: viewAllAnswersSections.flatMap(blocksFor) },
  }),
]
