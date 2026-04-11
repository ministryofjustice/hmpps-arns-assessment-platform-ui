import { step } from '@form-engine/form/builders'
import { pageHeading, pageContent } from './fields'

export const privacyPolicyStep = step({
  path: '/privacy-policy',
  title: 'Privacy policy for Assess and plan – sentence plan',
  view: {
    template: 'platform/views/platform-policy-step',
    locals: {
      footerBaseUrl: '/platform',
      hideSessionTimeoutModal: true,
      hmppsHeaderServiceNameLink: '/',
    },
  },
  blocks: [pageHeading, pageContent],
})
