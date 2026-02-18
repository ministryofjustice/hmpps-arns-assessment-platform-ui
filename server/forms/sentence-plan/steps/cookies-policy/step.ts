import { accessTransition, step } from '@form-engine/form/builders'
import { SentencePlanEffects } from '../../effects'
import { hasPostAgreementStatus, isSanSpAssessment } from '../../versions/v1.0/guards'
import { pageHeading, pageContent } from './fields'

export const cookiesPolicyStep = step({
  path: '/cookies-policy',
  title: 'Cookies policy',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      basePath: '/sentence-plan/v1.0',
      backlink: '/sentence-plan/v1.0/plan/overview',
      hmppsHeaderServiceNameLink: '/sentence-plan/v1.0/plan/overview',
      showAboutTab: isSanSpAssessment,
      showPlanHistoryTab: hasPostAgreementStatus,
    },
  },
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadSessionData(),
        SentencePlanEffects.initializeSessionFromAccess(),
        SentencePlanEffects.loadPlan(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
      ],
    }),
  ],
  blocks: [pageHeading, pageContent],
})
