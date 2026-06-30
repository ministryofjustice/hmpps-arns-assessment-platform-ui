import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, pageContent } from './fields'

export const cookiesPolicyStep = step({
  path: '/cookies-policy',
  title: 'Cookies policy for Assess and plan',
  view: {
    template: 'platform/views/platform-policy-step',
    locals: {
      footerBaseUrl: '/platform',
      hideSessionTimeoutModal: true,
    },
  },
  blocks: [pageHeading, pageContent],
})
