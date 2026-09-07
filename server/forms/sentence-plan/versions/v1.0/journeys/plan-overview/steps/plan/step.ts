import {
  Format,
  step,
  access,
  submit,
  validation,
  Query,
  redirect,
  and,
  not,
  or,
  Post,
  Data,
  Item,
  Condition,
  Iterator,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  blankPlanOverviewContent,
  blankPlanOverviewContentReadOnly,
  futureGoalsContent,
  goalsSection,
  planLastUpdatedMessage,
  planAgreedMessage,
  planCreatedMessage,
  updateAgreementMessage,
  subNavigation,
  notificationBanners,
} from './fields'
import { SentencePlanAuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { hasPostAgreementStatus, isOasysAccess, isPrintAndShareEnabled, isReadOnlyAccess } from '../../../../guards'

/**
 * True when at least one goal appears in a tab a draft plan can show.
 * REMOVED is left out because the removed tab only appears after agreement.
 */
const hasGoalsInDisplayedTabs = Data('goals')
  .each(
    Iterator.Filter(
      Item().path('status').match(Condition.Array.IsIn(['ACTIVE', 'FUTURE', 'ACHIEVED'])),
    ),
  )
  .pipe(Transformer.Array.Length())
  .match(Condition.Number.GreaterThan(0))

/**
 * A draft plan with no goals on show has nothing to print, so the button is hidden.
 * Once the plan reaches a post-agreement status the button always shows.
 */
const showPrintAllGoalsButton = and(isPrintAndShareEnabled, or(hasPostAgreementStatus, hasGoalsInDisplayedTabs))

export const planStep = step({
  path: '/overview',
  title: 'Plan',
  view: {
    locals: {
      headerPageHeading: Format(`%1 plan`, CaseData.ForenamePossessive),
      currentTab: Query('goalStatusTab'),
      buttons: {
        showPrintAllGoalsButton,
        showReturnToOasysButton: isOasysAccess,
        showCreateGoalButton: not(isReadOnlyAccess),
        // Only show "Agree plan" while still in draft and when the user has edit access.
        showAgreePlanButton: and(not(hasPostAgreementStatus), not(isReadOnlyAccess)),
      },
    },
  },
  validWhen: [
    validation({
      condition: Data('goals')
        .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
        .pipe(Transformer.Array.Length())
        .match(Condition.Number.GreaterThan(0)),
      message: 'To agree the plan, create a goal to work on now',
      details: { href: '#blank-plan-content' },
    }),
    Data('goals')
      .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
      .each(
        Iterator.Map(
          validation({
            condition: Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Number.GreaterThan(0)),
            message: Format("Add steps to '%1'", Item().path('title')),
            details: { href: Format('#goal-%1', Item().path('uuid')) },
          }),
        ),
      ),
  ],
  reachability: { entryWhen: true },
  blocks: [
    planLastUpdatedMessage,
    planAgreedMessage,
    planCreatedMessage,
    updateAgreementMessage,
    notificationBanners,
    subNavigation,
    goalsSection,
    blankPlanOverviewContentReadOnly,
    blankPlanOverviewContent,
    futureGoalsContent,
  ],
  onAccess: [
    access({
      when: and(Query('goalUuid').match(Condition.IsRequired()), not(isReadOnlyAccess)),
      effects: [SentencePlanEffects.reorderGoal()],
      next: [
        redirect({ when: Query('status').match(Condition.Equals('FUTURE')), goto: 'overview?goalStatusTab=future' }),
        redirect({
          when: Query('status').match(Condition.Equals('ACHIEVED')),
          goto: 'overview?goalStatusTab=achieved',
        }),
        redirect({ when: Query('status').match(Condition.Equals('REMOVED')), goto: 'overview?goalStatusTab=removed' }),
        redirect({ goto: 'overview?goalStatusTab=current' }),
      ],
    }),
    access({
      effects: [
        SentencePlanEffects.loadPlanTimeline(),
        SentencePlanEffects.derivePlanLastUpdated(),
        SentencePlanEffects.loadNotifications('plan-overview'),
        SentencePlanEffects.sendAuditEvent(SentencePlanAuditEvent.VIEW_PLAN_OVERVIEW, { tab: Query('goalStatusTab') }),
      ],
      next: [
        redirect({
          when: Query('goalStatusTab').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
          goto: 'overview?goalStatusTab=current',
        }),
      ],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('agree-plan')),
      validate: true,
      onValid: {
        next: [redirect({ goto: 'agree-plan' })],
      },
    }),
  ],
})
