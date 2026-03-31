import { Format, step, accessTransition, Query, redirect, Params, and, Data } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import {
  blankPlanOverviewContentReadOnly,
  futureGoalsContent,
  goalsSection,
  planAgreedMessage,
  planCreatedMessage,
  subNavigation,
  notificationBanners,
} from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { isOasysAccess } from '../../../../guards'

export const viewHistoricStep = step({
  path: '/view-historic/:timestamp',
  title: 'View historic version',
  view: {
    locals: {
      hidePreviousVersions: true,
      hideNavigation: true,
      hideFooter: true,
      disableHeaderLink: true,
      headerPageHeading: Format(`%1's plan`, CaseData.Forename),
      currentTab: Query('type'),
      buttons: {
        showReturnToOasysButton: and(isOasysAccess, Data('navigationReferrer').not.match(Condition.IsRequired())),
        showCreateGoalButton: false,
        showAgreePlanButton: false,
      },
      hasPlanOverviewErrors: false,
      alert: {
        title: 'Plan version date',
        message: Format(
          'This version is from %1',
          Params('timestamp').pipe(Transformer.String.ToTimestampDate(), Transformer.Date.Format('Do MMMM YYYY')),
        ),
      },
    },
  },
  isEntryPoint: true,
  blocks: [
    planAgreedMessage,
    planCreatedMessage,
    notificationBanners,
    subNavigation,
    goalsSection,
    blankPlanOverviewContentReadOnly,
    futureGoalsContent,
  ],
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadHistoricPlan(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_HISTORIC_PLAN, {
          planVersionTimestamp: Params('timestamp'),
        }),
      ],
      next: [
        redirect({
          when: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
          goto: Format('view-historic/%1?type=current', Params('timestamp')),
        }),
      ],
    }),
  ],
})
