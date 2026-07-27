import { access, Format, not, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { isPdfRenderRequest, redirectToOverviewUnlessPrintAndShareEnabled } from '../../../../guards'
import {
  achievedGoalsSection,
  activeGoalsSection,
  draftPlanWatermark,
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
    draftPlanWatermark,
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
    /*
     * Gotenberg builds the PDF by loading this page, so a download arrives here as a second
     * request. Both are audited, and the download is flagged so the two can be told apart.
     */
    access({
      when: not(isPdfRenderRequest),
      effects: [SentencePlanEffects.sendAuditEvent(AuditEvent.PRINT_ALL_GOALS)],
    }),
    access({
      when: isPdfRenderRequest,
      effects: [SentencePlanEffects.sendAuditEvent(AuditEvent.PRINT_ALL_GOALS, { exportedAsPdf: true })],
    }),
  ],
})
