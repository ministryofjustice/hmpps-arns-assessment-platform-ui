import {
  and,
  Data,
  Format,
  Item,
  Iterator,
  not,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { PrintGoalSummaryCard } from '../../../../../../components'
import { CaseData } from '../../../../constants'

type GoalStatus = 'ACTIVE' | 'FUTURE' | 'ACHIEVED' | 'REMOVED'

const hasLastUpdatedDetails = and(
  Data('isUpdatedAfterAgreement').match(Condition.Equals(true)),
  Data('lastUpdatedDate').match(Condition.IsRequired()),
  Data('lastUpdatedByName').match(Condition.IsRequired()),
)

export const planLastUpdatedMessage = GovUKBody({
  visibleWhen: hasLastUpdatedDetails,
  text: Format(
    'Last updated on %1 by %2.',
    Data('lastUpdatedDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
    Data('lastUpdatedByName'),
  ),
})

export const planAgreedMessage = GovUKBody({
  visibleWhen: and(
    not(hasLastUpdatedDetails),
    Data('latestAgreementDate').match(Condition.IsRequired()),
    Data('latestAgreementStatus').match(Condition.Array.IsIn(['AGREED', 'UPDATED_AGREED'])),
  ),
  text: Format(
    '%1 agreed to their plan on %2.',
    CaseData.Forename,
    Data('latestAgreementDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
  ),
})

export const planCreatedMessage = GovUKBody({
  visibleWhen: and(
    not(hasLastUpdatedDetails),
    Data('latestAgreementDate').match(Condition.IsRequired()),
    Data('latestAgreementStatus').match(Condition.Array.IsIn(['DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE'])),
  ),
  text: Format(
    'Plan created on %1.',
    Data('latestAgreementDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
  ),
})

const goalsByStatus = (status: GoalStatus) =>
  Data('goals').each(Iterator.Filter(Item().path('status').match(Condition.Equals(status))))

const hasGoalsByStatus = (status: GoalStatus) =>
  goalsByStatus(status).pipe(Transformer.Array.Length()).match(Condition.Number.GreaterThan(0))

const goalCard = () =>
  PrintGoalSummaryCard({
    goalTitle: Item().path('title'),
    goalStatus: Item().path('status'),
    targetDate: Item()
      .path('targetDate')
      .pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
    statusDate: Item()
      .path('statusDate')
      .pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
    areaOfNeed: Item().path('areaOfNeedLabel'),
    relatedAreasOfNeed: Item().path('relatedAreasOfNeedLabels'),
    steps: Item()
      .path('steps')
      .each(
        Iterator.Map({
          actor: Item().path('actorLabel'),
          description: Item().path('description'),
          status: Item().path('status'),
        }),
      ),
  })

const goalSection = (heading: string, status: GoalStatus, showWhenEmpty = false) =>
  TemplateWrapper({
    ...(showWhenEmpty ? {} : { visibleWhen: hasGoalsByStatus(status) }),
    template: `<section class="govuk-!-margin-top-6" aria-labelledby="goal-section-${status.toLowerCase()}">
      <h2 class="govuk-heading-m" id="goal-section-${status.toLowerCase()}">${heading}</h2>
      {{slot:goals}}
    </section>`,
    slots: {
      goals: [
        CollectionBlock({
          collection: goalsByStatus(status).each(Iterator.Map(goalCard())),
          ...(status === 'ACTIVE'
            ? {
                fallback: [
                  GovUKBody({ text: Format('%1 does not have any goals to work on now.', CaseData.Forename) }),
                ],
              }
            : {}),
        }),
      ],
    },
  })

export const activeGoalsSection = goalSection('Goals to work on now', 'ACTIVE', true)
export const futureGoalsSection = goalSection('Future goals', 'FUTURE')
export const achievedGoalsSection = goalSection('Achieved goals', 'ACHIEVED')
export const removedGoalsSection = goalSection('Removed goals', 'REMOVED')
