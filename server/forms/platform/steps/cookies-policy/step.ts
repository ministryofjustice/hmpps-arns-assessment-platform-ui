import { step } from '@form-engine/form/builders'
import { pageHeading, pageContent } from './fields'

export const cookiesPolicyStep = step({
  path: '/cookies-policy',
  title: 'Cookies policy',
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
