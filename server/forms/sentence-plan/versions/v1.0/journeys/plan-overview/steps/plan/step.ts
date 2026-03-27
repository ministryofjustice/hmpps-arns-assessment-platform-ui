import {
  Format,
  step,
  accessTransition,
  submitTransition,
  validation,
  Query,
  redirect,
  and,
  Post,
  Data,
  Item,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Transformer } from '@form-engine/registry/transformers'
import {
  blankPlanOverviewContent,
  blankPlanOverviewContentReadOnly,
  futureGoalsContent,
  goalsSection,
  planCreatedMessage,
  subNavigation,
  notificationBanners,
} from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { isOasysAccess, isReadWriteAccess, lacksPostAgreementStatus } from '../../../../guards'

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
  validate: [
    validation({
      when: Data('goals')
        .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
        .pipe(Transformer.Array.Length())
        .match(Condition.Equals(0)),
      message: 'To agree the plan, create a goal to work on now',
      details: { href: '#blank-plan-content' },
    }),
    Data('goals')
      .each(Iterator.Filter(Item().path('status').match(Condition.Equals('ACTIVE'))))
      .each(
        Iterator.Map(
          validation({
            when: Item().path('steps').pipe(Transformer.Array.Length()).match(Condition.Equals(0)),
            message: Format("Add steps to '%1'", Item().path('title')),
            details: { href: Format('#goal-%1', Item().path('uuid')) },
          }),
        ),
      ),
  ],
  isEntryPoint: true,
  blocks: [
    planCreatedMessage,
    notificationBanners,
    subNavigation,
    goalsSection,
    blankPlanOverviewContentReadOnly,
    blankPlanOverviewContent,
    futureGoalsContent,
  ],
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadNotifications('plan-overview'),
        SentencePlanEffects.setNavigationReferrer('plan-overview'),
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
    submitTransition({
      when: Post('action').match(Condition.Equals('agree-plan')),
      validate: true,
      onValid: {
        next: [redirect({ goto: 'agree-plan' })],
      },
    }),
  ],
})
