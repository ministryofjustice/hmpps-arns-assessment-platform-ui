import { step } from '@form-engine/form/builders'
import { pageHeading, pageContent } from './fields'

export const accessibilityStep = step({
  path: '/accessibility',
  title: 'Accessibility',
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
