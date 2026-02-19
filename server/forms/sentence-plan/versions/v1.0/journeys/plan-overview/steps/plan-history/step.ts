import { accessTransition, step } from '@form-engine/form/builders'
import { subtitleText, sectionBreak, agreementHistory, updateAgreementLink, backToTopLink } from './fields'
import { SentencePlanEffects } from '../../../../../../effects'
import { isOasysAccess, redirectIfNotPostAgreement, redirectToPrivacyUnlessAccepted } from '../../../../guards'

export const planHistoryStep = step({
  path: '/plan-history',
  title: 'Plan history',
  view: {
    locals: {
      headerPageHeading: 'Plan history',
      buttons: {
        showReturnToOasysButton: isOasysAccess,
      },
    },
  },
  blocks: [subtitleText, sectionBreak, agreementHistory, updateAgreementLink, backToTopLink],
  onAccess: [
    redirectToPrivacyUnlessAccepted(),
    accessTransition({
      effects: [
        SentencePlanEffects.loadPlanTimeline(),
        SentencePlanEffects.derivePlanHistoryEntries(),
        SentencePlanEffects.setNavigationReferrer('plan-history'),
      ],
    }),
    // Redirect to plan overview if plan is not yet agreed.
    // The overview step defaults missing type to current.
    redirectIfNotPostAgreement('overview'),
  ],
})
