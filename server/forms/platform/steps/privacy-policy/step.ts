import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, pageContent } from './fields'

export const privacyPolicyStep = step({
  path: '/privacy-policy',
  title: 'Privacy policy',
  view: {
    template: 'platform/views/platform-policy-step',
    locals: {
      footerBaseUrl: '/platform',
      hideSessionTimeoutModal: true,
    },
  },
  blocks: [pageHeading, pageContent],
})
