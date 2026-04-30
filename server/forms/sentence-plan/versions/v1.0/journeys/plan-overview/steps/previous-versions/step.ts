import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { isOasysAccess, redirectToPrivacyUnlessAccepted } from '../../../../guards'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { backToTopLink, previousVersions } from './fields'

export const previousVersionsStep = step({
  path: '/previous-versions',
  title: 'Previous versions',
  view: {
    locals: {
      hidePreviousVersions: true,
      headerPageHeading: 'Previous versions',
      buttons: {
        showReturnToOasysButton: isOasysAccess,
      },
    },
  },
  reachability: { entryWhen: true },
  blocks: [previousVersions, backToTopLink],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    access({
      effects: [
        SentencePlanEffects.loadPreviousVersions(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_PREVIOUS_VERSIONS),
      ],
    }),
  ],
})
