import { accessTransition, Data, redirect, step } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { subtitleText, sectionBreak, agreementHistory, updateAgreementLink, backToTopLink } from './fields'
import { POST_AGREEMENT_PROCESS_STATUSES, SentencePlanEffects } from '../../../../../../effects'

export const planHistoryStep = step({
  path: '/plan-history',
  title: 'Plan history',
  view: {
    locals: {
      headerPageHeading: 'Plan history',
      buttons: {
        showReturnToOasysButton: Data('user.authSource').match(Condition.Equals('OASYS')),
      },
    },
  },
  blocks: [subtitleText, sectionBreak, agreementHistory, updateAgreementLink, backToTopLink],
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadPlanTimeline(),
        SentencePlanEffects.derivePlanHistoryEntries(),
        SentencePlanEffects.setNavigationReferrer('plan-history'),
      ],
      next: [
        // Redirect to plan overview if plan is not yet agreed
        redirect({
          when: Data('latestAgreementStatus').not.match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)),
          goto: 'overview?type=current',
        }),
      ],
    }),
  ],
})
