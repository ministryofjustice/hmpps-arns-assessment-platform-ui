import { step, access, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  isOasysAccess,
  isReadOnlyAccess,
  redirectToOverviewUnlessSupervisionPackageEnabled,
  redirectToPrivacyUnlessAccepted,
} from '../../guards'
import { supervisionPackageSection } from './fields'
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
  blocks: [supervisionPackageSection],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    redirectToOverviewUnlessSupervisionPackageEnabled(),
    access({
      effects: [
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_SUPERVISION_PACKAGE),
        SentencePlanEffects.loadSupervisionPackage(),
      ],
    }),
  ],
})
