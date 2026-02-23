import { accessTransition, step } from '@form-engine/form/builders'
import { SentencePlanEffects } from '../../effects'
import { hasPostAgreementStatus, isSanSpAssessment } from '../../versions/v1.0/guards'
import { pageHeading, pageContent } from './fields'

export const accessibilityStep = step({
  path: '/accessibility',
  title: 'Accessibility',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      basePath: '/sentence-plan/v1.0',
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
