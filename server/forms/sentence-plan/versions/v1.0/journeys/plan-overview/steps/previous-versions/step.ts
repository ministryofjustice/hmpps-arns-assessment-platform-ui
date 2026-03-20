import { accessTransition, step } from '@form-engine/form/builders'
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
  isEntryPoint: true,
  blocks: [previousVersions, backToTopLink],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    accessTransition({
      effects: [
        SentencePlanEffects.loadPreviousVersions(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_PREVIOUS_VERSIONS),
      ],
    }),
  ],
})
