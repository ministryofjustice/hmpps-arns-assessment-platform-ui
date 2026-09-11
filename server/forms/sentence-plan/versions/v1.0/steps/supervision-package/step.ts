import { step, access, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  isOasysAccess,
  isReadOnlyAccess,
  redirectToOverviewUnlessSupervisionPackageAccessible,
  redirectToPrivacyUnlessAccepted,
} from '../../guards'
import { supervisionPackageSection, supervisionPackageErrorMessage } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../effects'

export const supervisionPackageStep = step({
  path: '/supervision-package',
  title: 'Supervision package',
  view: {
    locals: {
      headerPageHeading: 'Supervision package',
      buttons: {
        showReturnToOasysButton: isOasysAccess,
        showCreateGoalButton: not(isReadOnlyAccess),
      },
    },
  },
  blocks: [supervisionPackageSection, supervisionPackageErrorMessage],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    redirectToOverviewUnlessSupervisionPackageAccessible(),
    access({
      effects: [SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_SUPERVISION_PACKAGE)],
    }),
  ],
})
