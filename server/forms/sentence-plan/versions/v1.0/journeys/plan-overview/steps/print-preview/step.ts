import { access, Format, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { redirectToOverviewUnlessPrintAndShareEnabled } from '../../../../guards'
import {
  achievedGoalsSection,
  activeGoalsSection,
  futureGoalsSection,
  planAgreedMessage,
  planCreatedMessage,
  planLastUpdatedMessage,
  removedGoalsSection,
} from './fields'

export const printPreviewStep = step({
  path: '/print-preview',
  title: 'Print preview',
  reachability: { entryWhen: true },
  view: {
    locals: {
      user: null,
      disableHeaderLink: true,
      hideNavigation: true,
      hidePreviousVersions: true,
      hidePhaseBanner: true,
      hideBackToTop: true,
      headerPageHeading: Format('%1 plan', CaseData.ForenamePossessive),
      buttons: {
        showExportAsPdfButton: true,
        showPrintButton: true,
      },
    },
  },
  blocks: [
    planLastUpdatedMessage,
    planAgreedMessage,
    planCreatedMessage,
    activeGoalsSection,
    futureGoalsSection,
    achievedGoalsSection,
    removedGoalsSection,
  ],
  onAccess: [
    redirectToOverviewUnlessPrintAndShareEnabled(),
    access({
      effects: [SentencePlanEffects.loadPlanTimeline(), SentencePlanEffects.derivePlanLastUpdated()],
    }),
  ],
})
