import { Format, step, accessTransition, Query, redirect, Params } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import {
  blankPlanOverviewContentReadOnly,
  futureGoalsContent,
  goalsSection,
  planCreatedMessage,
  subNavigation,
  notificationBanners,
} from './fields'
import { SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'

export const viewHistoricStep = step({
  path: '/view-historic/:timestamp',
  title: 'View historic version',
  view: {
    locals: {
      hidePreviousVersions: true,
      headerPageHeading: Format(`%1's plan`, CaseData.Forename),
      currentTab: Query('type'),
      buttons: {
        showReturnToOasysButton: false,
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
    planCreatedMessage,
    notificationBanners,
    subNavigation,
    goalsSection,
    blankPlanOverviewContentReadOnly,
    futureGoalsContent,
  ],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadHistoricPlan(), SentencePlanEffects.setNavigationReferrer('previous-versions')],
      next: [
        redirect({
          when: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
          goto: Format('view-historic/%1?type=current', Params('timestamp')),
        }),
      ],
    }),
  ],
})
