import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { isOasysAccess, redirectToPrivacyUnlessAccepted } from '../../../../guards'
import { SentencePlanAuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { previousVersions } from './fields'

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
  blocks: [previousVersions],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    access({
      effects: [
        SentencePlanEffects.loadPreviousVersions(),
        SentencePlanEffects.sendAuditEvent(SentencePlanAuditEvent.VIEW_PREVIOUS_VERSIONS),
      ],
    }),
  ],
})
