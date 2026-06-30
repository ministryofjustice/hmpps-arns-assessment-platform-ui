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
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { isOasysAccess, isReadOnlyAccess, isReadWriteAccess, lacksPostAgreementStatus } from '../../../../guards'

export const planStep = step({
  path: '/overview',
  title: 'Plan',
  view: {
    locals: {
      headerPageHeading: Format(`%1 plan`, CaseData.ForenamePossessive),
      currentTab: Query('type'),
      buttons: {
        showReturnToOasysButton: isOasysAccess,
        showCreateGoalButton: isReadWriteAccess,
        // Only show "Agree plan" while still in draft and when the user has edit access.
        showAgreePlanButton: and(lacksPostAgreementStatus, isReadWriteAccess),
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
        redirect({ when: Query('status').match(Condition.Equals('FUTURE')), goto: 'overview?type=future' }),
        redirect({ when: Query('status').match(Condition.Equals('ACHIEVED')), goto: 'overview?type=achieved' }),
        redirect({ when: Query('status').match(Condition.Equals('REMOVED')), goto: 'overview?type=removed' }),
        redirect({ goto: 'overview?type=current' }),
      ],
    }),
    access({
      effects: [
        SentencePlanEffects.loadPlanTimeline(),
        SentencePlanEffects.derivePlanLastUpdated(),
        SentencePlanEffects.loadNotifications('plan-overview'),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_PLAN_OVERVIEW, { tab: Query('type') }),
      ],
      next: [
        redirect({
          when: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
          goto: 'overview?type=current',
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
